'use strict';
const path     = require('path');
const os       = require('os');
const fs       = require('fs');
const AdmZip   = require('adm-zip');
const pdfParse = require('pdf-parse');
const Lesson   = require('../models/Lesson');

/* ─── Mapping UE ─────────────────────────────────────────────────────────── */
const UE_MAP = {
  '1.1': 'UE 1.1 — Psychologie, sociologie, anthropologie',
  '1.2': 'UE 1.2 — Santé publique et économie de la santé',
  '1.3': 'UE 1.3 — Législation, éthique, déontologie',
  '2.1': 'UE 2.1 — Biologie fondamentale',
  '2.2': 'UE 2.2 — Cycles de la vie et grandes fonctions',
  '2.3': 'UE 2.3 — Santé, maladie, handicap, accidents de la vie',
  '2.4': 'UE 2.4 — Processus traumatiques',
  '2.5': 'UE 2.5 — Processus infectieux et inflammatoires',
  '2.6': 'UE 2.6 — Processus psychopathologiques',
  '2.7': 'UE 2.7 — Défaillances organiques et processus dégénératifs',
  '2.8': 'UE 2.8 — Processus obstructifs',
  '2.10':'UE 2.10 — Infectiologie, hygiène',
  '2.11':'UE 2.11 — Pharmacologie et thérapeutique',
  '3.1': 'UE 3.1 — Raisonnement et démarche clinique',
  '3.2': 'UE 3.2 — Projet de soins infirmiers',
  '3.4': 'UE 3.4 — Initiation à la démarche de recherche',
  '4.4': 'UE 4.4 — Thérapeutiques et contribution au diagnostic',
};

function parseUE(f)       { const m = f.match(/^(\d+\.\d+)/); return m ? m[1] : null; }
function parseSemester(s) { const m = s.match(/S(\d+)/i);     return m ? `Semestre ${m[1]}` : ''; }
function cleanTitle(f) {
  return f.replace(/\.pdf$/i, '').replace(/\s*\(\d+\)\s*$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}
async function extractText(buf) {
  try { const d = await pdfParse(buf, { max: 8 }); return (d.text || '').trim().slice(0, 8000); }
  catch { return ''; }
}

module.exports = async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'Aucun fichier ZIP reçu' });

  const log = [];
  let inserted = 0, skipped = 0, errors = 0;

  try {
    // Décompresser le ZIP en mémoire
    const zip     = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName.replace(/\\/g, '/');
      const parts     = entryName.split('/');

      // Filtrer : on ne prend que les PDF dans Cours/
      const filename = parts[parts.length - 1];
      if (!filename.toLowerCase().endsWith('.pdf')) continue;
      if (!parts.includes('Cours')) continue;

      const ci  = parts.indexOf('Cours');
      const sem = parts[ci + 1] || '';
      const ue  = parts[ci + 2] || '';
      const sub = parts[ci + 3] || '';

      // Sauter les TD
      if (sub.toLowerCase() === 'td') continue;

      const ueCode = parseUE(ue);
      if (!ueCode) continue;

      const title    = cleanTitle(filename);
      const semester = parseSemester(sem);
      const category = UE_MAP[ueCode] || `UE ${ueCode}`;

      // Doublon ?
      const exists = await Lesson.findOne({ title, category }).lean();
      if (exists) { skipped++; log.push(`⊘ Doublon : ${title}`); continue; }

      try {
        const fileBuffer = entry.getData();
        const content    = await extractText(fileBuffer);

        await Lesson.create({
          title,
          type:        'cours',
          content,
          summary:     '',
          semester,
          category,
          chapter:     '',
          tags:        [ueCode, semester].filter(Boolean),
          difficulty:  'medium',
          isPublished: true,
          fileData:    fileBuffer,
          fileMimeType:'application/pdf',
          fileName:    filename,
          fileSize:    fileBuffer.length,
          hasFile:     true,
        });

        inserted++;
        log.push(`✓ [${semester}] ${category} — ${title}`);
        console.log(`[SeedCours] ✓ ${title}`);
      } catch (e) {
        errors++;
        log.push(`✗ ERREUR ${title} : ${e.message}`);
        console.error(`[SeedCours] ✗ ${title}:`, e.message);
      }
    }

    res.json({
      ok: true,
      message: `${inserted} cours importés, ${skipped} doublons, ${errors} erreurs`,
      inserted, skipped, errors, log,
    });
  } catch (err) {
    console.error('[SeedCours ZIP]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
