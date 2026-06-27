'use strict';
const Anthropic = require('@anthropic-ai/sdk');
const Lesson    = require('../models/Lesson');
const Quiz      = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

const MODEL      = 'claude-haiku-4-5-20251001';
const MIN_CONTENT = 100;

/* ─── Durée estimée ──────────────────────────────────────────────────────── */
function quizDuration(n) {
  if (n <= 8)  return 7;
  if (n <= 12) return 10;
  if (n <= 16) return 14;
  return 18;
}

function difficultyLabel(n) {
  if (n <= 8)  return 'easy';
  if (n <= 12) return 'medium';
  return 'hard';
}

/* ─── Prompt 1 : analyse du cours → chapitres ───────────────────────────── */
function promptAnalyse(title, ueLabel, semester) {
  return `Tu es un expert du programme IFSI français (référentiel 2009 réformé).

Analyse ce cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}

Décompose ce cours en chapitres/thèmes distincts tels qu'ils sont réellement enseignés dans les IFSI en France.
Pour chaque chapitre, détermine librement le nombre de questions QCM selon la richesse réelle du sujet.

Règles de décomposition :
- Cours court ou introduction → 1 chapitre
- Cours standard → 2 chapitres
- Cours riche (plusieurs mécanismes, traitements, complications) → 3 chapitres
- Cours très complet (ex: pharmacologie, infectiologie) → 4 chapitres maximum
- Chaque chapitre doit pouvoir générer des questions DISTINCTES des autres chapitres

Règles sur le nombre de questions :
- Minimum : 8 questions par chapitre
- Maximum absolu : 20 questions par chapitre
- Adapte librement selon la richesse du contenu (pas de quota imposé entre 8 et 20)
- Un sujet riche en définitions, valeurs, médicaments, signes cliniques → 15 à 20 questions
- Un sujet introductif ou court → 8 à 10 questions

Réponds UNIQUEMENT en JSON valide :
{
  "chapters": [
    { "title": "Titre précis du chapitre 1", "questions": 15 },
    { "title": "Titre précis du chapitre 2", "questions": 20 }
  ]
}`;
}

/* ─── Prompt 2 : génération QCM pour un chapitre ────────────────────────── */
function promptQCM(courseTitle, chapterTitle, ueLabel, semester, content, nbQuestions) {
  const hasContent = content && content.length >= MIN_CONTENT;
  const source = hasContent
    ? `Extrait du cours :\n---\n${content.slice(0, 5000)}\n---`
    : `(PDF non lisible — génère depuis tes connaissances approfondies du programme IFSI français)`;

  const niveauLabel = nbQuestions <= 8
    ? 'Niveau accessible — définitions et reconnaissances'
    : nbQuestions <= 12
    ? 'Niveau standard — mécanismes et application clinique'
    : nbQuestions <= 16
    ? 'Niveau complet — raisonnement clinique, valeurs précises, gestes infirmiers'
    : 'Niveau expert — cas cliniques, associations, surveillance infirmière approfondie';

  return `Tu es un formateur IFSI expert en France. Génère exactement ${nbQuestions} questions QCM.

Cours : "${courseTitle}"
Chapitre ciblé : "${chapterTitle}"
UE : ${ueLabel}
Semestre : ${semester}
Niveau : ${niveauLabel}
${source}

IMPORTANT : Les questions doivent porter UNIQUEMENT sur le chapitre "${chapterTitle}", pas sur le cours en général.

Réponds UNIQUEMENT en JSON valide :
{
  "questions": [
    {
      "text": "Question précise sur ${chapterTitle} ?",
      "options": [
        { "text": "Proposition A", "isCorrect": false },
        { "text": "Proposition B", "isCorrect": true },
        { "text": "Proposition C", "isCorrect": false },
        { "text": "Proposition D", "isCorrect": false }
      ],
      "explanation": "Explication concise de la bonne réponse."
    }
  ]
}

Règles ABSOLUES :
- Exactement ${nbQuestions} questions, pas une de plus, pas une de moins
- 1 seule bonne réponse par question, toujours 4 options
- LONGUEUR DES OPTIONS : toutes les options doivent être de longueur similaire (±5 mots). La bonne réponse ne doit PAS être plus longue que les mauvaises. Si la bonne réponse est longue, rends les mauvaises tout aussi longues.
- POSITION : varie la position de la bonne réponse (A, B, C ou D) de façon aléatoire — ne mets pas toujours la bonne réponse en B ou en dernière position.
- Options incorrectes plausibles et crédibles (jamais fantaisistes ni évidentes)
- Conforme au référentiel infirmier français`;
}

/* ─── Prompt Flashcards ──────────────────────────────────────────────────── */
function promptFlashcards(title, ueLabel, semester, content) {
  const hasContent = content && content.length >= MIN_CONTENT;
  const source = hasContent
    ? `Extrait du cours :\n---\n${content.slice(0, 5000)}\n---`
    : `(PDF non lisible — génère depuis tes connaissances approfondies du programme IFSI français)`;

  return `Tu es un formateur IFSI expert en France. Génère 12 flashcards de révision.

Cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}
${source}

Réponds UNIQUEMENT en JSON valide :
{
  "flashcards": [
    {
      "front": "Terme, notion clé ou question courte (1 ligne max)",
      "back": "Réponse claire et mémorisable (2-4 lignes max)",
      "hint": "Moyen mnémotechnique ou contexte clinique (peut être vide)"
    }
  ]
}

Règles :
- Exactement 12 flashcards
- Recto : un seul concept par carte
- Verso : réponse directe et complète
- Couvrir les notions essentielles : définitions, valeurs clés, signes, traitements, surveillance infirmière
- Conforme au référentiel IFSI français`;
}

/* ─── Appel Anthropic ────────────────────────────────────────────────────── */
async function callAI(client, prompt, maxTokens = 4000) {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: maxTokens,
    messages:   [{ role: 'user', content: prompt }],
  });
  const raw   = msg.content[0]?.text || '';
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Réponse IA non-JSON : ' + raw.slice(0, 100));
  return JSON.parse(raw.slice(start, end + 1));
}

/* ─── Handler principal ──────────────────────────────────────────────────── */
module.exports = async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return res.status(503).json({ ok: false, message: 'ANTHROPIC_API_KEY non configurée dans les variables Railway' });
  }

  const mode     = req.query.mode || 'both';
  const testMode = req.query.test === 'true';

  const client = new Anthropic({ apiKey });
  const log    = [];
  let quizInserted = 0, flashInserted = 0, skipped = 0, errors = 0;

  try {
    const allLessons = await Lesson.find({})
      .select('title semester category chapter content').lean();

    if (allLessons.length === 0) {
      return res.json({ ok: false, message: "Aucun cours en base. Importe d'abord les cours (Option A)." });
    }

    let lessons = testMode ? allLessons.slice(0, 1) : allLessons;
    console.log(`[GenContent] ${lessons.length} cours, mode=${mode}, test=${testMode}`);

    for (let idx = 0; idx < lessons.length; idx++) {
      const lesson = lessons[idx];
      const { title, semester, category, chapter, content } = lesson;
      const ueLabel = category || 'UE inconnue';
      const chap    = chapter || title;

      console.log(`[GenContent] → [${idx+1}/${lessons.length}] ${title}`);

      // ── QUIZ ──
      if (mode === 'quiz' || mode === 'both') {
        // Étape 1 : analyser le cours pour obtenir ses chapitres
        let chapters;
        try {
          const analysis = await callAI(client, promptAnalyse(title, ueLabel, semester), 800);
          chapters = analysis.chapters;
          if (!Array.isArray(chapters) || chapters.length === 0) throw new Error('Aucun chapitre retourné');
          // Sécurité : max 4 chapitres, questions entre 8 et 15
          chapters = chapters.slice(0, 4).map(c => ({
            title:     c.title,
            questions: Math.min(20, Math.max(8, parseInt(c.questions) || 10)),
          }));
          console.log(`[GenContent]   → ${chapters.length} chapitre(s) détecté(s)`);
        } catch (e) {
          // Fallback : 1 seul quiz de 10 questions sur le cours entier
          chapters = [{ title, questions: 10 }];
          log.push(`⚠ Analyse impossible pour "${title}" → 1 quiz de 10 questions`);
        }
        await new Promise(r => setTimeout(r, 500));

        // Étape 2 : générer 1 quiz par chapitre
        for (const chapterDef of chapters) {
          const quizTitle = chapters.length === 1
            ? `Quiz — ${title}`
            : `Quiz — ${title} · ${chapterDef.title}`;

          const exists = await Quiz.findOne({ title: quizTitle, category }).lean();
          if (exists) {
            skipped++;
            log.push(`⊘ Quiz déjà présent : ${quizTitle}`);
            continue;
          }

          try {
            const parsed = await callAI(client, promptQCM(title, chapterDef.title, ueLabel, semester, content, chapterDef.questions));
            const qs = parsed.questions;
            if (!qs?.length) throw new Error('0 questions retournées');

            for (const q of qs) {
              const nbCorrect = q.options.filter(o => o.isCorrect).length;
              if (nbCorrect !== 1) throw new Error(`"${q.text.slice(0,40)}" : ${nbCorrect} bonne(s) réponse(s)`);
            }

            // chapter = sous-thème IA si plusieurs, sinon titre du cours
            const quizChapter = chapters.length === 1 ? chap : chapterDef.title;

            await Quiz.create({
              title:         quizTitle,
              description:   `${qs.length} questions · "${chapterDef.title}" (${ueLabel}, ${semester})`,
              semester,
              category,
              chapter:       quizChapter,
              isAIGenerated: true,
              questions:   qs.map(q => ({
                text:        q.text,
                type:        'qcm',
                explanation: q.explanation || '',
                options:     q.options,
              })),
              difficulty:  difficultyLabel(chapterDef.questions),
              duration:    quizDuration(chapterDef.questions),
              isPublished: true,
            });

            quizInserted++;
            log.push(`✓ Quiz (${qs.length} q.) : [${semester}] ${ueLabel} — ${chapterDef.title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Quiz ERREUR "${quizTitle}" : ${e.message}`);
            console.error(`[GenContent] Quiz erreur:`, e.message);
          }
          await new Promise(r => setTimeout(r, 800));
        }
      }

      // ── FLASHCARDS ──
      if (mode === 'flashcards' || mode === 'both') {
        const exists = await Flashcard.findOne({ chapter: chap, category }).lean();
        if (exists) {
          skipped++;
          log.push(`⊘ Flashcards déjà présentes : ${title}`);
        } else {
          try {
            const parsed = await callAI(client, promptFlashcards(title, ueLabel, semester, content));
            const fcs = parsed.flashcards;
            if (!fcs?.length) throw new Error('0 flashcards retournées');

            await Flashcard.insertMany(fcs.map(f => ({
              front:         f.front,
              back:          f.back,
              hint:          f.hint || '',
              semester,
              category,
              chapter:       chap,
              difficulty:    'medium',
              isPublished:   true,
              isAIGenerated: true,
            })));

            flashInserted += fcs.length;
            log.push(`✓ Flashcards (${fcs.length}) : [${semester}] ${ueLabel} — ${title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Flashcards ERREUR "${title}" : ${e.message}`);
            console.error(`[GenContent] Flash erreur:`, e.message);
          }
          await new Promise(r => setTimeout(r, 800));
        }
      }
    }

    const generated = log.filter(l => l.startsWith('✓'));
    const locationHint = generated.length
      ? generated.map(l => l.replace('✓ ', '')).join(' | ')
      : '';

    const summary = testMode
      ? `TEST OK — ${quizInserted} quiz · ${flashInserted} flashcards. Généré sur : ${locationHint}. Va dans Quiz ou Flashcards et navigue vers ce semestre/UE pour vérifier.`
      : `${quizInserted} quiz · ${flashInserted} flashcards générés · ${skipped} doublons ignorés · ${errors} erreurs`;

    res.json({ ok: true, message: summary, quizInserted, flashInserted, skipped, errors, log });
  } catch (err) {
    console.error('[GenContent]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
