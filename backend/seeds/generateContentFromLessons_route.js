'use strict';
const Anthropic = require('@anthropic-ai/sdk');
const Lesson    = require('../models/Lesson');
const Quiz      = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

const MODEL          = 'claude-haiku-4-5-20251001';
const MIN_CONTENT    = 100; // chars : en dessous on génère depuis les connaissances IA

/* ─── Prompt QCM ─────────────────────────────────────────────────────────── */
function promptQCM(title, ueLabel, semester, content) {
  const hasContent = content && content.length >= MIN_CONTENT;
  const source = hasContent
    ? `Contenu du cours :\n---\n${content.slice(0, 6000)}\n---`
    : `(PDF non lisible — génère depuis tes connaissances approfondies du programme IFSI français sur ce sujet)`;

  return `Tu es un formateur IFSI expert en France. Génère 8 questions QCM rigoureuses pour des étudiants infirmiers.

Cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}
${source}

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
      "explanation": "Explication concise de pourquoi cette réponse est correcte."
    }
  ]
}

Règles :
- Exactement 8 questions
- 1 seule bonne réponse par question, toujours 4 options
- Varier : définitions, mécanismes physiopathologiques, traitements, signes cliniques, rôle infirmier
- Niveau examen IFSI réaliste, conforme au référentiel de formation français
- Options incorrectes plausibles (pas fantaisistes)`;
}

/* ─── Prompt Flashcards ──────────────────────────────────────────────────── */
function promptFlashcards(title, ueLabel, semester, content) {
  const hasContent = content && content.length >= MIN_CONTENT;
  const source = hasContent
    ? `Contenu du cours :\n---\n${content.slice(0, 6000)}\n---`
    : `(PDF non lisible — génère depuis tes connaissances approfondies du programme IFSI français sur ce sujet)`;

  return `Tu es un formateur IFSI expert en France. Génère 12 flashcards de révision pour des étudiants infirmiers.

Cours : "${title}"
UE : ${ueLabel}
Semestre : ${semester}
${source}

Réponds UNIQUEMENT en JSON valide (aucun texte avant ou après) :
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
- Recto : un seul concept / terme / question par carte
- Verso : réponse directe, complète, sans reformuler le recto
- Couvrir les notions essentielles : définitions, valeurs clés, signes, traitements, surveillance infirmière
- Conforme au référentiel IFSI français`;
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

    if (allLessons.length === 0) {
      return res.json({ ok: false, message: 'Aucun cours en base. Importe d\'abord les cours (Option A).' });
    }

    const withText = allLessons.filter(l => (l.content || '').length >= MIN_CONTENT);
    const noText   = allLessons.filter(l => (l.content || '').length < MIN_CONTENT);
    console.log(`[GenContent] Total: ${allLessons.length} | avec texte: ${withText.length} | PDFs scannés: ${noText.length}`);

    // On traite TOUS les cours — l'IA génère depuis ses connaissances si le PDF est scanné
    let lessons = allLessons;

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

    // Construire le résumé avec les détails de localisation
    const generated = log.filter(l => l.startsWith('✓'));
    const locationHint = generated.length
      ? generated.map(l => l.replace('✓ ', '')).join(' | ')
      : '';

    const summary = testMode
      ? `TEST OK — Généré sur : ${locationHint}. Va dans Quiz ou Flashcards et navigue vers ce semestre/UE pour vérifier.`
      : `${quizInserted} quiz · ${flashInserted} flashcards générés · ${skipped} doublons ignorés · ${errors} erreurs`;

    res.json({ ok: true, message: summary, quizInserted, flashInserted, skipped, errors, log });
  } catch (err) {
    console.error('[GenContent]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
