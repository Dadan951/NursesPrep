'use strict';
const Anthropic = require('@anthropic-ai/sdk');
const Lesson    = require('../models/Lesson');
const Quiz      = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

const MODEL = 'claude-haiku-4-5-20251001';

/* ─── Prompt QCM ─────────────────────────────────────────────────────────── */
function promptQCM(title, content) {
  return `Tu es un formateur IFSI expert. Génère 8 questions QCM à partir de ce cours infirmier.

Cours : "${title}"
Contenu :
${content.slice(0, 6000)}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "questions": [
    {
      "text": "Question claire et précise ?",
      "options": [
        { "text": "Réponse A", "isCorrect": false },
        { "text": "Réponse B", "isCorrect": true },
        { "text": "Réponse C", "isCorrect": false },
        { "text": "Réponse D", "isCorrect": false }
      ],
      "explanation": "Explication courte de la bonne réponse."
    }
  ]
}

Règles :
- Exactement 8 questions
- 1 seule bonne réponse par question
- Questions variées (définitions, mécanismes, traitements, signes cliniques)
- Niveau IFSI réaliste
- Toujours 4 options par question`;
}

/* ─── Prompt Flashcards ──────────────────────────────────────────────────── */
function promptFlashcards(title, content) {
  return `Tu es un formateur IFSI expert. Génère 12 flashcards de révision à partir de ce cours infirmier.

Cours : "${title}"
Contenu :
${content.slice(0, 6000)}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "flashcards": [
    {
      "front": "Notion / question courte à retenir",
      "back": "Réponse concise et claire (2-3 lignes max)",
      "hint": "Indice mnémotechnique optionnel"
    }
  ]
}

Règles :
- Exactement 12 flashcards
- Recto : terme, définition à compléter, ou question courte
- Verso : réponse complète et mémorisable
- Couvrir les concepts clés du cours`;
}

/* ─── Appel Anthropic avec retry ─────────────────────────────────────────── */
async function callAI(client, prompt) {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 2048,
    messages:   [{ role: 'user', content: prompt }],
  });
  const raw = msg.content[0]?.text || '';
  // Extraire le JSON (parfois l'IA met du texte avant/après)
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Pas de JSON dans la réponse IA');
  return JSON.parse(raw.slice(start, end + 1));
}

/* ─── Handler principal ──────────────────────────────────────────────────── */
module.exports = async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return res.status(503).json({ ok: false, message: 'ANTHROPIC_API_KEY non configurée' });
  }

  // Paramètre : générer quiz, flashcards ou les deux
  const mode = req.query.mode || 'both'; // 'quiz' | 'flashcards' | 'both'

  const client = new Anthropic({ apiKey });
  const log    = [];
  let quizInserted = 0, flashInserted = 0, errors = 0;

  try {
    // Récupérer uniquement les cours avec du texte extrait
    const lessons = await Lesson.find({
      isPublished: true,
      content:     { $exists: true, $ne: '' },
    }).select('title semester category chapter content').lean();

    if (!lessons.length) {
      return res.json({ ok: false, message: 'Aucun cours avec du texte trouvé. Importe d\'abord les cours (Option A).' });
    }

    console.log(`[GenContent] ${lessons.length} cours à traiter, mode: ${mode}`);

    for (const lesson of lessons) {
      const { title, semester, category, chapter, content } = lesson;
      console.log(`[GenContent] → ${title}`);

      // ── QCM ──
      if (mode === 'quiz' || mode === 'both') {
        const alreadyQuiz = await Quiz.findOne({ title: `Quiz — ${title}`, category }).lean();
        if (alreadyQuiz) {
          log.push(`⊘ Quiz déjà existant : ${title}`);
        } else {
          try {
            const parsed = await callAI(client, promptQCM(title, content));
            if (!parsed.questions?.length) throw new Error('0 questions générées');

            await Quiz.create({
              title:       `Quiz — ${title}`,
              description: `QCM généré automatiquement à partir du cours "${title}"`,
              semester,
              category,
              chapter:     chapter || title,
              questions:   parsed.questions.map(q => ({
                text:        q.text,
                type:        'qcm',
                explanation: q.explanation || '',
                options:     q.options,
              })),
              difficulty:  'medium',
              duration:    12,
              isPublished: true,
            });

            quizInserted++;
            log.push(`✓ Quiz (${parsed.questions.length} Q) : ${title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Quiz ERREUR "${title}" : ${e.message}`);
            console.error(`[GenContent] Quiz erreur ${title}:`, e.message);
          }
        }
      }

      // ── Flashcards ──
      if (mode === 'flashcards' || mode === 'both') {
        const alreadyFlash = await Flashcard.findOne({ chapter: title, category }).lean();
        if (alreadyFlash) {
          log.push(`⊘ Flashcards déjà existantes : ${title}`);
        } else {
          try {
            const parsed = await callAI(client, promptFlashcards(title, content));
            if (!parsed.flashcards?.length) throw new Error('0 flashcards générées');

            const docs = parsed.flashcards.map(f => ({
              front:      f.front,
              back:       f.back,
              hint:       f.hint || '',
              semester,
              category,
              chapter:    chapter || title,
              difficulty: 'medium',
              isPublished:true,
            }));
            await Flashcard.insertMany(docs);

            flashInserted += docs.length;
            log.push(`✓ Flashcards (${docs.length}) : ${title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Flashcards ERREUR "${title}" : ${e.message}`);
            console.error(`[GenContent] Flash erreur ${title}:`, e.message);
          }
        }
      }

      // Pause pour éviter le rate-limit Anthropic
      await new Promise(r => setTimeout(r, 800));
    }

    res.json({
      ok: true,
      message: `${quizInserted} quiz générés · ${flashInserted} flashcards générées · ${errors} erreurs`,
      quizInserted, flashInserted, errors, log,
    });
  } catch (err) {
    console.error('[GenContent]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
