'use strict';
const Anthropic = require('@anthropic-ai/sdk');
const Lesson    = require('../models/Lesson');
const Quiz      = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

const MODEL          = 'claude-haiku-4-5-20251001';
const MIN_CONTENT    = 100; // chars minimum pour qu'un cours soit utilisable

/* ─── Prompt QCM ─────────────────────────────────────────────────────────── */
function promptQCM(title, ueLabel, semester, content) {
  return `Tu es un formateur IFSI expert. Génère 8 questions QCM rigoureuses à partir de ce cours infirmier.

Cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}
Contenu du cours :
---
${content.slice(0, 6000)}
---

Réponds UNIQUEMENT en JSON valide (aucun texte avant ou après) :
{
  "questions": [
    {
      "text": "Question précise et sans ambiguïté ?",
      "options": [
        { "text": "Proposition A complète", "isCorrect": false },
        { "text": "Proposition B complète", "isCorrect": true },
        { "text": "Proposition C complète", "isCorrect": false },
        { "text": "Proposition D complète", "isCorrect": false }
      ],
      "explanation": "Explication concise de pourquoi B est correct et les autres non."
    }
  ]
}

Règles strictes :
- Exactement 8 questions tirées UNIQUEMENT du contenu fourni
- 1 seule bonne réponse par question, toujours 4 options
- Varier les types : définitions, mécanismes physiopathologiques, traitements, signes cliniques, gestes infirmiers
- Niveau examen IFSI réaliste (ni trop facile ni hors programme)
- Les options incorrectes doivent être plausibles (pas fantaisistes)
- Ne jamais inventer des données absentes du cours`;
}

/* ─── Prompt Flashcards ──────────────────────────────────────────────────── */
function promptFlashcards(title, ueLabel, semester, content) {
  return `Tu es un formateur IFSI expert. Génère 12 flashcards de révision à partir de ce cours infirmier.

Cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}
Contenu du cours :
---
${content.slice(0, 6000)}
---

Réponds UNIQUEMENT en JSON valide (aucun texte avant ou après) :
{
  "flashcards": [
    {
      "front": "Terme, notion clé ou question courte à retenir (1 ligne max)",
      "back": "Réponse claire, mémorisable, complète (2-4 lignes max)",
      "hint": "Moyen mnémotechnique court ou contexte clinique (optionnel, peut être vide)"
    }
  ]
}

Règles strictes :
- Exactement 12 flashcards tirées UNIQUEMENT du contenu fourni
- Recto : un seul concept / terme / question par carte
- Verso : réponse directe, sans reformuler le recto
- Couvrir les notions les plus importantes du cours (définitions, valeurs clés, signes, traitements, rôle infirmier)
- Ne jamais inventer des données absentes du cours`;
}

/* ─── Appel Anthropic ────────────────────────────────────────────────────── */
async function callAI(client, prompt) {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 2500,
    messages:   [{ role: 'user', content: prompt }],
  });
  const raw   = msg.content[0]?.text || '';
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Réponse IA non-JSON');
  return JSON.parse(raw.slice(start, end + 1));
}

/* ─── Handler principal ──────────────────────────────────────────────────── */
module.exports = async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return res.status(503).json({ ok: false, message: 'ANTHROPIC_API_KEY non configurée dans les variables Railway' });
  }

  const mode    = req.query.mode || 'both';   // 'quiz' | 'flashcards' | 'both'
  const testMode = req.query.test === 'true';  // ne traiter que 1 cours pour vérifier

  const client = new Anthropic({ apiKey });
  const log    = [];
  let quizInserted = 0, flashInserted = 0, skipped = 0, errors = 0;

  try {
    // Récupérer tous les cours (sans filtre isPublished pour éviter les problèmes)
    const allLessons = await Lesson.find({})
      .select('title semester category chapter content').lean();

    const withText  = allLessons.filter(l => (l.content || '').length >= MIN_CONTENT);
    const noText    = allLessons.filter(l => (l.content || '').length < MIN_CONTENT);

    console.log(`[GenContent] Total en base: ${allLessons.length}, avec texte: ${withText.length}, sans texte: ${noText.length}`);

    if (allLessons.length === 0) {
      return res.json({ ok: false, message: 'Aucun cours en base. Importe d\'abord les cours (Option A).' });
    }

    let lessons = withText;

    if (!lessons.length) {
      return res.json({
        ok: false,
        message: `${allLessons.length} cours trouvés en base, mais tous sont des PDFs scannés (pas de texte extractible). L'IA ne peut pas générer de contenu sans texte. (PDFs scannés ignorés : ${noText.map(l => l.title).slice(0,3).join(', ')}…)`,
      });
    }

    if (testMode) {
      lessons = lessons.slice(0, 1); // test sur 1 seul cours
    }

    console.log(`[GenContent] ${lessons.length} cours éligibles, mode=${mode}, test=${testMode}`);

    for (const lesson of lessons) {
      const { title, semester, category, chapter, content } = lesson;
      const ueLabel = category || 'UE inconnue';
      const chap    = chapter || title;

      console.log(`[GenContent] → ${title} (${content.length} chars)`);

      // ── QUIZ ──
      if (mode === 'quiz' || mode === 'both') {
        const exists = await Quiz.findOne({ title: `Quiz — ${title}`, category }).lean();
        if (exists) {
          skipped++;
          log.push(`⊘ Quiz déjà présent : ${title}`);
        } else {
          try {
            const parsed = await callAI(client, promptQCM(title, ueLabel, semester, content));
            const qs = parsed.questions;
            if (!qs?.length) throw new Error('0 questions retournées');

            // Vérification basique : chaque question doit avoir exactement 1 bonne réponse
            for (const q of qs) {
              const nbCorrect = q.options.filter(o => o.isCorrect).length;
              if (nbCorrect !== 1) throw new Error(`Question "${q.text.slice(0,40)}…" : ${nbCorrect} bonne(s) réponse(s) au lieu de 1`);
            }

            await Quiz.create({
              title:       `Quiz — ${title}`,
              description: `8 questions sur "${title}" (${ueLabel}, ${semester})`,
              semester,
              category,
              chapter:     chap,
              questions:   qs.map(q => ({
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
            log.push(`✓ Quiz (${qs.length} questions) : [${semester}] ${ueLabel} — ${title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Quiz ERREUR "${title}" : ${e.message}`);
            console.error(`[GenContent] Quiz erreur "${title}":`, e.message);
          }
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
              front:       f.front,
              back:        f.back,
              hint:        f.hint || '',
              semester,
              category,
              chapter:     chap,
              difficulty:  'medium',
              isPublished: true,
            })));

            flashInserted += fcs.length;
            log.push(`✓ Flashcards (${fcs.length}) : [${semester}] ${ueLabel} — ${title}`);
          } catch (e) {
            errors++;
            log.push(`✗ Flashcards ERREUR "${title}" : ${e.message}`);
            console.error(`[GenContent] Flash erreur "${title}":`, e.message);
          }
        }
      }

      // Pause anti-rate-limit Anthropic
      await new Promise(r => setTimeout(r, 1000));
    }

    const summary = testMode
      ? `TEST OK — ${quizInserted} quiz · ${flashInserted} flashcards générés sur 1 cours. Lance "Les deux" pour tout générer.`
      : `${quizInserted} quiz · ${flashInserted} flashcards générés · ${skipped} doublons ignorés · ${errors} erreurs`;

    res.json({ ok: true, message: summary, quizInserted, flashInserted, skipped, errors, log });
  } catch (err) {
    console.error('[GenContent]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
