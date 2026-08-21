/**
 * Générateur de flashcards via l'API Claude (Sonnet 5).
 *
 * Usage:
 *   node scripts/generateFlashcards.js \
 *     --category "UE 2.5 - Processus inflammatoires et infectieux" \
 *     --chapter "Infections ostéo-articulaires" \
 *     --semester "Semestre 3" \
 *     --context "Ostéomyélite, spondylodiscite, arthrite septique, infection sur prothèse..."
 *
 * Génère 5 parties de 20 flashcards (100 au total), valide le format,
 * et insère en base (idempotent : ignore les parties déjà présentes).
 */

const dns = require('dns');
dns.setServers(['192.168.1.254']);
require('dotenv').config();

const mongoose = require('mongoose');
const Anthropic = require('@anthropic-ai/sdk');
const { z } = require('zod');
const { zodOutputFormat } = require('@anthropic-ai/sdk/helpers/zod');
const Flashcard = require('../models/Flashcard');

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

const CardSchema = z.object({
  front: z.string().describe('La question, courte et précise (verso caché)'),
  back: z.string().describe("La réponse complète mais concise, avec l'explication clinique utile"),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

const PartSchema = z.object({
  name: z.string().describe('Nom de la partie, ex: "Partie 1"'),
  theme: z.string().describe('Titre du sous-thème couvert par cette partie'),
  cards: z.array(CardSchema).length(20),
});

const FlashcardSetSchema = z.object({
  parts: z.array(PartSchema).length(5),
});

async function generate({ category, chapter, semester, context, model }) {
  const client = new Anthropic();

  const systemPrompt = `Tu es un professeur formateur en IFSI (Institut de Formation en Soins Infirmiers) en France, expert du programme infirmier (diplôme d'État). Tu rédiges des flashcards pédagogiques de très haute qualité, factuellement exactes, conformes aux recommandations françaises actuelles (HAS, SPILF, etc.), pour des étudiants infirmiers.

Règles impératives :
- Contenu 100% en français, terminologie médicale française standard.
- "front" : une question claire et autonome (pas de "vrai/faux" vague), qui tient en une phrase.
- "back" : une réponse complète, dense mais concise (1 à 3 phrases), directement utile pour un étudiant infirmier — pas de remplissage.
- Pas de doublons de contenu entre les 5 parties.
- Difficulté variée mais majoritairement "medium", avec quelques "easy" (définitions de base) et quelques "hard" (situations cliniques complexes, physiopathologie fine).
- Chaque partie doit couvrir un sous-thème cohérent et distinct du chapitre, progressant logiquement (définitions/généralités → diagnostic → traitement → complications → prévention/rôle infirmier, adapté au sujet).
- Le rôle infirmier doit être représenté (au moins une partie orientée pratique infirmière/éducation thérapeutique/surveillance).`;

  const userPrompt = `Génère un set de 100 flashcards (5 parties de 20) pour le chapitre "${chapter}" de l'UE "${category}".

Contexte/notions à couvrir (non exhaustif, sers-toi en comme fil conducteur) :
${context}

Retourne exactement 5 parties nommées "Partie 1" à "Partie 5", chacune avec exactement 20 cartes.`;

  const response = await client.messages.parse({
    model: model || 'claude-sonnet-5',
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    output_config: { format: zodOutputFormat(FlashcardSetSchema) },
  });

  if (!response.parsed_output) {
    throw new Error('Échec du parsing structuré de la réponse Claude.');
  }

  console.log('Usage — input:', response.usage.input_tokens, 'output:', response.usage.output_tokens);

  return response.parsed_output.parts;
}

async function main() {
  const args = parseArgs();
  const { category, chapter, semester, context, model, programVersion } = args;

  if (!category || !chapter || !context) {
    console.error('Usage: node generateFlashcards.js --category "..." --chapter "..." --semester "..." --context "..."');
    process.exit(1);
  }

  console.log(`Génération des flashcards pour "${chapter}" (${category})...`);
  const parts = await generate({ category, chapter, semester, context, model });

  parts.forEach((p) => {
    if (p.cards.length !== 20) throw new Error(`${p.name} a ${p.cards.length} cartes, attendu 20`);
  });
  console.log('Validation OK. Total cartes:', parts.reduce((sum, p) => sum + p.cards.length, 0));
  parts.forEach((p) => console.log(`  ${p.name}: ${p.theme}`));

  await mongoose.connect(process.env.MONGO_URI);
  let created = 0;
  for (const p of parts) {
    const docs = p.cards.map((c) => ({
      front: c.front,
      back: c.back,
      semester: semester || '',
      programVersion: programVersion || 'ancien',
      category,
      chapter,
      part: p.name,
      difficulty: c.difficulty,
      hint: '',
      isPublished: true,
      isAIGenerated: true,
    }));
    const existing = await Flashcard.countDocuments({ category, chapter, part: p.name });
    if (existing > 0) {
      console.log('Déjà existant, ignoré:', p.name, `(${existing} cartes)`);
      continue;
    }
    await Flashcard.insertMany(docs);
    created += docs.length;
    console.log('Créé:', p.name, `(${docs.length} cartes)`);
  }
  console.log('Terminé. Cartes créées:', created);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
