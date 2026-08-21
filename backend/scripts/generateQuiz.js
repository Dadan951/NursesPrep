/**
 * Générateur de quiz (mix QCU + QCM) via l'API Claude (Sonnet 5).
 *
 * Usage (nombre de questions uniforme) :
 *   node scripts/generateQuiz.js \
 *     --category "UE 2.5 - Processus inflammatoires et infectieux" \
 *     --chapter "Infections ostéo-articulaires" \
 *     --semester "Semestre 3" \
 *     --context "Ostéomyélite, spondylodiscite, arthrite septique, infection sur prothèse..." \
 *     --quizzes 20 \
 *     --questionsPerQuiz 15
 *
 * Usage (répartition par palier, ex. 6 quiz de 10 + 7 de 15 + 7 de 20) :
 *   node scripts/generateQuiz.js \
 *     --category "..." --chapter "..." --semester "..." --context "..." \
 *     --plan "10x6,15x7,20x7"
 *   (chaque terme "questions x nombre_de_quiz" ; générés palier par palier,
 *   en tenant compte des questions déjà générées dans les paliers précédents
 *   pour éviter les doublons intra-chapitre)
 *
 * Génère N quiz de M questions chacun pour un chapitre donné, avec un mélange
 * réaliste (~70/30) de deux formats, comme les quiz existants (ex. UE 2.8) :
 *  - QCU (Question à Choix Unique) : 4 options, 1 seule correcte.
 *  - QCM (Question à Choix Multiple) : 5 options, 2 ou 3 correctes.
 *
 * Anti-doublon (comme lors de la construction manuelle des quiz) :
 *  1. Les questions déjà en base pour ce chapitre sont récupérées et transmises
 *     au modèle comme liste à ne PAS reformuler.
 *  2. Après génération, une vérification stricte détecte les doublons exacts
 *     ET quasi-exacts (similarité de mots élevée) — au sein du lot généré ET
 *     contre l'existant en base. En cas de doublon, RIEN n'est inséré : le
 *     script s'arrête avec la liste des doublons détectés pour relance.
 *
 * Valide aussi le format (QCU : 4 options/1 correcte ; QCM : 5 options/2-3
 * correctes) avant insertion. Insertion idempotente : ignore les quiz dont
 * le titre existe déjà.
 *
 * IMPORTANT : ce script appelle l'API Claude et consomme des tokens payants
 * (facturation à la carte, séparée de l'abonnement Claude Code).
 * Il n'est PAS exécuté automatiquement — lance-le toi-même quand tu es prêt.
 */

const dns = require('dns');
dns.setServers(['192.168.1.254']);
require('dotenv').config();

const mongoose = require('mongoose');
const Anthropic = require('@anthropic-ai/sdk');
const { z } = require('zod');
const { zodOutputFormat } = require('@anthropic-ai/sdk/helpers/zod');
const Quiz = require('../models/Quiz');

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1];
      args[key] = value;
      i++;
    }
  }
  return args;
}

const OptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string().describe('Énoncé de la question, précis et sans ambiguïté'),
  multipleAnswers: z.boolean().describe('false = QCU (4 options, 1 seule correcte) ; true = QCM (5 options, 2 ou 3 correctes)'),
  options: z.array(OptionSchema).min(4).max(5).describe('4 options pour un QCU, 5 pour un QCM ; longueurs similaires entre elles'),
  explanation: z.string().describe('Explication concise justifiant la ou les bonne(s) réponse(s)'),
});

const QuizSchema = z.object({
  title: z.string().describe('Titre court et spécifique du quiz (sous-thème couvert)'),
  questions: z.array(QuestionSchema),
});

const QuizSetSchema = z.object({
  quizzes: z.array(QuizSchema),
});

function difficultyFromCount(n) {
  if (n <= 8) return 'easy';
  if (n <= 14) return 'medium';
  return 'hard';
}

function durationFromCount(n) {
  if (n <= 8) return 7;
  if (n <= 12) return 10;
  if (n <= 16) return 14;
  return 18;
}

/* ─── Anti-doublon ─────────────────────────────────────────────────────── */

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordSet(text) {
  // >= 2 (pas > 2) : ce chapitre est plein d'abréviations anglaises à 2 lettres
  // porteuses de sens (RR, ER, IV, BP, HR...) qu'un filtre trop strict effacerait,
  // rendant deux questions sur des abréviations différentes faussement identiques.
  return new Set(normalize(text).split(' ').filter((w) => w.length >= 2));
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

const NEAR_DUP_THRESHOLD = 0.8;

/**
 * Extrait le(s) terme(s) entre guillemets d'une question (ex: « physician », "RR").
 * Beaucoup de questions de ce générateur suivent un gabarit fixe ("Que signifie
 * le mot anglais « X » ?") où seul X change — un Jaccard brut sur le texte entier
 * les confond à tort. Si les deux questions ont un terme cité et qu'il diffère,
 * ce n'est PAS un doublon, quel que soit le score de similarité du reste de la phrase.
 */
function extractQuotedTerms(text) {
  const matches = [...(text || '').matchAll(/[«"“]([^»"”]{1,60})[»"”]/g)];
  return matches.map((m) => normalize(m[1]));
}

/** Retourne la liste des paires en doublon (exact ou quasi-exact) entre deux listes de questions { text, source }. */
function findDuplicates(questionsA, questionsB, sameArray) {
  const dups = [];
  const setsB = questionsB.map((q) => ({ q, norm: normalize(q.text), set: wordSet(q.text), quoted: extractQuotedTerms(q.text) }));
  questionsA.forEach((qa, i) => {
    const normA = normalize(qa.text);
    const setA = wordSet(qa.text);
    const quotedA = extractQuotedTerms(qa.text);
    setsB.forEach(({ q: qb, norm: normB, set: setB, quoted: quotedB }, j) => {
      if (sameArray && j <= i) return;
      if (sameArray && qa === qb) return;
      const exact = normA === normB;
      if (!exact && quotedA.length && quotedB.length) {
        const sameTerm = quotedA.some((t) => quotedB.includes(t));
        if (!sameTerm) return; // gabarit partagé mais terme cité différent → pas un doublon
      }
      const near = !exact && jaccard(setA, setB) >= NEAR_DUP_THRESHOLD;
      if (exact || near) {
        dups.push({ a: qa, b: qb, type: exact ? 'exact' : 'quasi-exact' });
      }
    });
  });
  return dups;
}

async function fetchExistingQuestions(category, chapter) {
  const existingQuizzes = await Quiz.find({ category, chapter }).select('questions').lean();
  const questions = [];
  existingQuizzes.forEach((q) => {
    (q.questions || []).forEach((question) => {
      questions.push({ text: question.text, source: 'base de données' });
    });
  });
  return questions;
}

/** Compte, par nombre de questions (10/15/20...), combien de quiz existent déjà pour ce chapitre. */
async function fetchTierCounts(category, chapter) {
  const existingQuizzes = await Quiz.find({ category, chapter }).select('questions').lean();
  const counts = {};
  existingQuizzes.forEach((q) => {
    const n = (q.questions || []).length;
    counts[n] = (counts[n] || 0) + 1;
  });
  return counts;
}

function parsePlan(planStr) {
  // "10x6,15x7,20x7" -> [{ questionsPerQuiz: 10, nbQuizzes: 6 }, ...]
  return planStr.split(',').map((term) => {
    const [q, n] = term.trim().split('x').map((v) => parseInt(v, 10));
    if (!q || !n) throw new Error(`Terme de plan invalide: "${term}" (attendu "questionsxquiz", ex. "10x6")`);
    return { questionsPerQuiz: q, nbQuizzes: n };
  });
}

// Au-delà d'un certain max_tokens, le SDK exige le streaming (requêtes non-stream
// limitées à 10 min). On reste sous ce seuil en découpant les gros paliers en
// sous-lots plutôt que d'implémenter le streaming. Marge large car les QCM
// (5 options + explication) coûtent sensiblement plus de tokens que prévu.
const SAFE_MAX_TOKENS = 22000;
const TOKENS_PER_QUESTION = 400;
const JSON_OVERHEAD = 3000;

function estimateMaxTokens(nbQuizzes, questionsPerQuiz) {
  const estimate = nbQuizzes * questionsPerQuiz * TOKENS_PER_QUESTION + JSON_OVERHEAD;
  return Math.max(8000, Math.min(SAFE_MAX_TOKENS, Math.ceil(estimate / 1000) * 1000));
}

/** Découpe un palier {nbQuizzes, questionsPerQuiz} en sous-lots restant sous SAFE_MAX_TOKENS. */
function chunkTier({ nbQuizzes, questionsPerQuiz }) {
  const chunkSize = Math.max(1, Math.floor((SAFE_MAX_TOKENS - JSON_OVERHEAD) / (questionsPerQuiz * TOKENS_PER_QUESTION)));
  const chunks = [];
  let remaining = nbQuizzes;
  while (remaining > 0) {
    const n = Math.min(chunkSize, remaining);
    chunks.push({ questionsPerQuiz, nbQuizzes: n });
    remaining -= n;
  }
  return chunks;
}

async function generate({ category, chapter, context, nbQuizzes, questionsPerQuiz, model, existingQuestions, maxTokens }) {
  const client = new Anthropic();

  const systemPrompt = `Tu es un professeur formateur en IFSI (Institut de Formation en Soins Infirmiers) en France, expert du programme infirmier (diplôme d'État). Tu rédiges des quiz de très haute qualité, factuellement exacts, conformes aux recommandations françaises actuelles (HAS, SPILF, etc.), pour des étudiants infirmiers, en mélangeant deux formats comme dans les épreuves IFSI réelles :
- QCU (Question à Choix Unique) : 4 options, UNE SEULE correcte. → multipleAnswers: false
- QCM (Question à Choix Multiple) : 5 options, 2 OU 3 correctes (jamais 1, jamais 4 ni 5). → multipleAnswers: true

Règles impératives pour chaque question :
- Contenu 100% en français, terminologie médicale française standard.
- Environ 70% des questions de chaque quiz doivent être des QCU et 30% des QCM, répartis de façon variée dans le quiz (pas tous les QCM à la fin).
- Respecte STRICTEMENT le nombre d'options et de bonnes réponses attendu selon le type (voir ci-dessus) — jamais d'erreur de comptage.
- Toutes les options d'une même question doivent avoir une longueur similaire (±5 mots) — les bonnes réponses ne doivent jamais être visiblement plus longues ou plus détaillées que les autres.
- Varie la position des bonnes réponses de façon équilibrée sur l'ensemble des questions — ne les mets pas toujours au même endroit.
- Les options incorrectes doivent être plausibles et crédibles, jamais absurdes ou évidentes.
- L'explication doit justifier brièvement pourquoi la ou les bonnes réponses sont correctes (et implicitement pourquoi les autres ne le sont pas, pour un QCM).
- AUCUN DOUBLON : pas deux questions qui posent la même chose reformulée différemment, ni entre les quiz que tu génères maintenant, ni avec les questions déjà existantes listées ci-dessous (si fournies). Chaque question doit interroger un fait ou un raisonnement distinct.
- Chaque quiz doit couvrir un sous-thème cohérent et distinct du chapitre (progression logique : généralités → diagnostic → traitement → complications → rôle infirmier, adapté au sujet).`;

  const existingBlock = existingQuestions && existingQuestions.length
    ? `\n\nQuestions déjà existantes pour ce chapitre — NE PAS les reformuler ni poser une question qui revient au même :\n${existingQuestions.map((q) => `- ${q.text}`).join('\n')}`
    : '';

  const userPrompt = `Génère ${nbQuizzes} quiz de ${questionsPerQuiz} questions chacun (mélange QCU/QCM, ~70%/30%) pour le chapitre "${chapter}" de l'UE "${category}".

Contexte/notions à couvrir (non exhaustif, sers-toi en comme fil conducteur) :
${context}${existingBlock}

Retourne exactement ${nbQuizzes} quiz, chacun avec exactement ${questionsPerQuiz} questions.`;

  const response = await client.messages.parse({
    model: model || 'claude-sonnet-5',
    max_tokens: maxTokens || 64000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    output_config: { format: zodOutputFormat(QuizSetSchema) },
  });

  if (!response.parsed_output) {
    throw new Error('Échec du parsing structuré de la réponse Claude.');
  }

  console.log('Usage — input:', response.usage.input_tokens, 'output:', response.usage.output_tokens);

  return response.parsed_output.quizzes;
}

async function main() {
  const args = parseArgs();
  const { category, chapter, semester, context, model, programVersion } = args;

  if (!category || !chapter || !context) {
    console.error('Usage: node generateQuiz.js --category "..." --chapter "..." --semester "..." --context "..." [--quizzes 20] [--questionsPerQuiz 15] | [--plan "10x6,15x7,20x7"]');
    process.exit(1);
  }

  const tiers = args.plan
    ? parsePlan(args.plan)
    : [{ questionsPerQuiz: parseInt(args.questionsPerQuiz || '15', 10), nbQuizzes: parseInt(args.quizzes || '20', 10) }];

  await mongoose.connect(process.env.MONGO_URI);
  const existingQuestions = await fetchExistingQuestions(category, chapter);
  console.log(`Questions déjà en base pour ce chapitre : ${existingQuestions.length}`);

  const tierCounts = await fetchTierCounts(category, chapter);

  const cumulativeExisting = [...existingQuestions];
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalQuestions = 0;
  let totalQCU = 0;
  let totalQCM = 0;

  for (const tier of tiers) {
    const already = tierCounts[tier.questionsPerQuiz] || 0;
    const remaining = Math.max(0, tier.nbQuizzes - already);
    if (remaining === 0) {
      console.log(`\n→ Palier ${tier.nbQuizzes} quiz de ${tier.questionsPerQuiz} questions : déjà complet en base (${already}/${tier.nbQuizzes}), passage au suivant.`);
      continue;
    }
    if (already > 0) {
      console.log(`\n→ Palier ${tier.nbQuizzes} quiz de ${tier.questionsPerQuiz} questions : ${already} déjà en base, reste ${remaining} à générer.`);
    }
    const subChunks = chunkTier({ nbQuizzes: remaining, questionsPerQuiz: tier.questionsPerQuiz });
    console.log(`→ Palier: ${remaining} quiz de ${tier.questionsPerQuiz} questions pour "${chapter}" (${category})` + (subChunks.length > 1 ? ` — découpé en ${subChunks.length} sous-lots` : '') + '...');

    for (const chunk of subChunks) {
      console.log(`  · sous-lot: ${chunk.nbQuizzes} quiz de ${chunk.questionsPerQuiz} questions`);
      const maxTokens = estimateMaxTokens(chunk.nbQuizzes, chunk.questionsPerQuiz);
      const chunkQuizzes = await generate({
        category, chapter, context,
        nbQuizzes: chunk.nbQuizzes,
        questionsPerQuiz: chunk.questionsPerQuiz,
        model, maxTokens,
        existingQuestions: cumulativeExisting,
      });

      // 1) Validation format QCU/QCM strict
      const chunkNewQuestions = [];
      chunkQuizzes.forEach((q) => {
        q.questions.forEach((question) => {
          const nbCorrect = question.options.filter((o) => o.isCorrect).length;
          if (question.multipleAnswers) {
            if (question.options.length !== 5 || nbCorrect < 2 || nbCorrect > 3) {
              throw new Error(`Question "${question.text.slice(0, 50)}" n'est pas un QCM valide (${question.options.length} options, ${nbCorrect} bonne(s) réponse(s), attendu 5 options / 2-3 correctes)`);
            }
            totalQCM++;
          } else {
            if (question.options.length !== 4 || nbCorrect !== 1) {
              throw new Error(`Question "${question.text.slice(0, 50)}" n'est pas un QCU valide (${question.options.length} options, ${nbCorrect} bonne(s) réponse(s), attendu 4 options / 1 correcte)`);
            }
            totalQCU++;
          }
          chunkNewQuestions.push({ text: question.text, source: q.title });
        });
        totalQuestions += q.questions.length;
      });
      console.log(`    Validation OK (${chunkNewQuestions.length} questions).`);

      // 2) Anti-doublon : au sein du sous-lot ET contre tout ce qui précède (base + sous-lots déjà générés)
      const dupsWithinChunk = findDuplicates(chunkNewQuestions, chunkNewQuestions, true);
      const dupsWithExisting = cumulativeExisting.length ? findDuplicates(chunkNewQuestions, cumulativeExisting, false) : [];
      const allDups = [...dupsWithinChunk, ...dupsWithExisting];

      if (allDups.length > 0) {
        console.error(`\n✗ ${allDups.length} doublon(s) détecté(s) dans ce sous-lot — AUCUNE insertion pour ce sous-lot. Les sous-lots précédents restent en base (déjà insérés). Relance le script : il reprendra depuis l'existant en base.\n`);
        allDups.forEach((d) => {
          console.error(`  [${d.type}] "${d.a.text}" (${d.a.source})\n           ≈ "${d.b.text}" (${d.b.source})`);
        });
        await mongoose.disconnect();
        process.exit(1);
      }
      console.log('    Anti-doublon OK.');

      // 3) Insertion immédiate de ce sous-lot (durable même si un sous-lot suivant échoue)
      for (const q of chunkQuizzes) {
        const title = `Quiz — ${chapter} · ${q.title}`;
        const exists = await Quiz.findOne({ title, category }).lean();
        if (exists) {
          console.log('    Déjà existant, ignoré:', title);
          totalSkipped++;
          continue;
        }
        await Quiz.create({
          title,
          description: `${q.questions.length} questions · "${q.title}" (${category}, ${semester || ''})`,
          semester: semester || '',
          programVersion: programVersion || 'ancien',
          category,
          chapter,
          isAIGenerated: true,
          questions: q.questions.map((question) => ({
            text: question.text,
            type: 'qcm',
            explanation: question.explanation || '',
            options: question.options,
            multipleAnswers: !!question.multipleAnswers,
          })),
          difficulty: difficultyFromCount(q.questions.length),
          duration: durationFromCount(q.questions.length),
          isPublished: true,
        });
        totalCreated++;
        console.log('    Créé:', title);
      }

      cumulativeExisting.push(...chunkNewQuestions);
    }
  }

  console.log(`\nTerminé. Quiz créés: ${totalCreated} — ignorés (déjà existants): ${totalSkipped} — questions totales générées: ${totalQuestions} (${totalQCU} QCU, ${totalQCM} QCM)`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
