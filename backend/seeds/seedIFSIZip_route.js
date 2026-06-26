'use strict';
const AdmZip   = require('adm-zip');
const pdfParse = require('pdf-parse');
const Lesson   = require('../models/Lesson');

/* ─── Mapping UE complet ─────────────────────────────────────────────────── */
const UE_MAP = {
  '1.1':'UE 1.1 — Psychologie, sociologie, anthropologie',
  '1.2':'UE 1.2 — Santé publique et économie de la santé',
  '1.3':'UE 1.3 — Législation, éthique, déontologie',
  '2.1':'UE 2.1 — Biologie fondamentale',
  '2.2':'UE 2.2 — Cycles de la vie et grandes fonctions',
  '2.3':'UE 2.3 — Santé, maladie, handicap, accidents de la vie',
  '2.4':'UE 2.4 — Processus traumatiques',
  '2.5':'UE 2.5 — Processus infectieux et inflammatoires',
  '2.6':'UE 2.6 — Processus psychopathologiques',
  '2.7':'UE 2.7 — Défaillances organiques et processus dégénératifs',
  '2.8':'UE 2.8 — Processus obstructifs',
  '2.9':'UE 2.9 — Processus tumoraux',
  '2.10':'UE 2.10 — Infectiologie, hygiène',
  '2.11':'UE 2.11 — Pharmacologie et thérapeutique',
  '3.1':'UE 3.1 — Raisonnement et démarche clinique infirmière',
  '3.2':'UE 3.2 — Projet de soins infirmiers',
  '3.3':'UE 3.3 — Rôles infirmiers, organisation du travail et interprofessionnalité',
  '3.4':'UE 3.4 — Initiation à la démarche de recherche',
  '3.5':'UE 3.5 — Encadrement des professionnels de soins',
  '4.1':'UE 4.1 — Soins de confort et de bien-être',
  '4.2':'UE 4.2 — Soins relationnels',
  '4.3':'UE 4.3 — Soins d\'urgence',
  '4.4':'UE 4.4 — Thérapeutiques et contribution au diagnostic médical',
  '4.5':'UE 4.5 — Soins infirmiers et gestion des risques',
  '4.6':'UE 4.6 — Soins éducatifs et préventifs',
  '4.7':'UE 4.7 — Soins palliatifs et de fin de vie',
  '4.8':'UE 4.8 — Qualité des soins, évaluation des pratiques',
  '5.1':'UE 5.1 — Accompagnement dans la réalisation des soins quotidiens',
  '5.2':'UE 5.2 — Évaluation d\'une situation clinique',
  '5.3':'UE 5.3 — Communication et conduite de projet',
  '5.4':'UE 5.4 — Soins éducatifs et formation des professionnels',
  '5.5':'UE 5.5 — Mise en œuvre des thérapeutiques et coordination des soins',
  '5.6':'UE 5.6 — Analyse de la qualité et traitement des données scientifiques',
  '5.7':'UE 5.7 — Unité d\'enseignement optionnelle',
  '5.8':'UE 5.8 — Unité d\'enseignement optionnelle 2',
  '6.1':'UE 6.1 — Méthodes de travail et TIC',
  '6.2':'UE 6.2 — Anglais',
};

function parseSemester(folder) {
  const m = folder.match(/semestre\s+(\d+)/i);
  return m ? `Semestre ${m[1]}` : '';
}

function parseUECode(folder) {
  const m = folder.trim().match(/^UE\s+(\d+\.\d+)$/i);
  return m ? m[1] : null;
}

function cleanTitle(filename) {
  return filename.replace(/\.pdf$/i,'').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
}

async function extractText(buf) {
  try {
    const d = await pdfParse(buf, { max: 8 });
    return (d.text || '').trim().slice(0, 8000);
  } catch { return ''; }
}

module.exports = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0)
    return res.status(400).json({ ok: false, message: 'Aucun fichier ZIP reçu' });

  const log = [];
  let inserted = 0, skipped = 0, errors = 0;

  try {
    for (const file of files) {
      const zip     = new AdmZip(file.buffer);
      const entries = zip.getEntries();

      for (const entry of entries) {
        if (entry.isDirectory) continue;

        const entryName = entry.entryName.replace(/\\/g, '/');
        const parts     = entryName.split('/');
        const filename  = parts[parts.length - 1];

        // Seulement les PDFs
        if (!filename.toLowerCase().endsWith('.pdf')) continue;

        // Trouver le dossier "semestre X"
        const semPart = parts.find(p => /^semestre\s+\d+$/i.test(p.trim()));
        if (!semPart) continue;

        const semIdx  = parts.indexOf(semPart);
        // Le dossier SUIVANT doit être "UE X.X" directement
        const uePart  = parts[semIdx + 1] || '';
        const ueCode  = parseUECode(uePart);
        if (!ueCode) continue; // fiches, partiels, audio, planning → skip

        const semester = parseSemester(semPart);
        const category = UE_MAP[ueCode] || `UE ${ueCode}`;
        const title    = cleanTitle(filename);

        // Doublon
        const exists = await Lesson.findOne({ title, category }).lean();
        if (exists) {
          skipped++;
          continue;
        }

        try {
          const buf     = entry.getData();
          const content = await extractText(buf);

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
            fileData:    buf,
            fileMimeType:'application/pdf',
            fileName:    filename,
            fileSize:    buf.length,
            hasFile:     true,
          });

          inserted++;
          log.push(`✓ [${semester}] ${category} — ${title}`);
        } catch (e) {
          errors++;
          log.push(`✗ ${title} : ${e.message}`);
        }
      }
    }

    res.json({
      ok: true,
      message: `${inserted} cours importés · ${skipped} doublons ignorés · ${errors} erreurs`,
      inserted, skipped, errors, log,
    });
  } catch (err) {
    console.error('[SeedIFSI ZIP]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
