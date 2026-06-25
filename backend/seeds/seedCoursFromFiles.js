'use strict';
const fs       = require('fs');
const path     = require('path');
const pdfParse = require('pdf-parse');
const Lesson   = require('../models/Lesson');

/* ─── Mapping dossier → métadonnées ─────────────────────────────────────── */
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

// Extrait le code UE depuis le nom du dossier (ex: "2.5 _ maladies infectieuses" → "2.5")
function parseUE(folderName) {
  const m = folderName.match(/^(\d+\.\d+)/);
  return m ? m[1] : null;
}

// Déduit le semestre depuis "S1", "S2"…
function parseSemester(sFolder) {
  const m = sFolder.match(/S(\d+)/i);
  return m ? `Semestre ${m[1]}` : '';
}

// Titre propre depuis le nom de fichier PDF
function cleanTitle(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/\s*\(\d+\)\s*$/, '')      // supprime les (1), (2) en fin
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extrait le texte d'un PDF (retourne '' si scanné ou illisible)
async function extractText(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer, { max: 8 }); // max 8 pages pour la rapidité
    return (data.text || '').trim().slice(0, 8000);
  } catch {
    return '';
  }
}

/* ─── Fonction principale ────────────────────────────────────────────────── */
async function seedCoursFromFiles(extractedRoot) {
  const results = { inserted: 0, skipped: 0, errors: [] };
  const coursRoot = path.join(extractedRoot, 'Nurses Prep');

  if (!fs.existsSync(coursRoot)) {
    throw new Error(`Dossier introuvable : ${coursRoot}`);
  }

  // Parcourir récursivement et collecter les PDF
  const pdfFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.toLowerCase().endsWith('.pdf')) pdfFiles.push(full);
    }
  }
  walk(coursRoot);

  for (const pdfPath of pdfFiles) {
    try {
      const rel   = path.relative(coursRoot, pdfPath);        // ex: 1A\Cours\S3\2.5 _ maladies\file.pdf
      const parts = rel.split(path.sep);                      // ['1A','Cours','S3','2.5 _ ...','file.pdf']

      // Ne traiter que les Cours (pas Annales, pas Flash carte, pas QCM)
      if (!parts.includes('Cours')) continue;

      const coursIdx   = parts.indexOf('Cours');
      const sFolder    = parts[coursIdx + 1] || '';           // 'S1', 'S3'…
      const ueFolder   = parts[coursIdx + 2] || '';           // '1.1', '2.5 _ maladies infectieuses'
      const subFolder  = parts[coursIdx + 3] || '';           // sous-dossier optionnel (TD…)
      const filename   = parts[parts.length - 1];

      // Sauter les TD (travaux dirigés)
      if (subFolder.toLowerCase() === 'td') continue;

      const ueCode = parseUE(ueFolder);
      if (!ueCode) continue;

      const semester = parseSemester(sFolder);
      const category = UE_MAP[ueCode] || `UE ${ueCode}`;
      const title    = cleanTitle(filename);

      // Vérifier doublon
      const exists = await Lesson.findOne({ title, category }).lean();
      if (exists) { results.skipped++; continue; }

      // Lire le PDF
      const fileBuffer = fs.readFileSync(pdfPath);
      const fileSize   = fileBuffer.length;

      // Extraire le texte
      const content = await extractText(fileBuffer);

      // Insérer en base
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
        fileSize,
        hasFile:     true,
      });

      results.inserted++;
      console.log(`  ✓ [${semester}] ${category} — ${title}`);

    } catch (err) {
      results.errors.push({ file: pdfPath, err: err.message });
      console.error(`  ✗ ${path.basename(pdfPath)}: ${err.message}`);
    }
  }

  return results;
}

module.exports = seedCoursFromFiles;
