'use strict';
/**
 * Script d'import local → API backend déployée.
 * Usage : node seeds/uploadCoursViaAPI.js
 *
 * Nécessite : npm install axios form-data (ou utilise les modules déjà présents)
 */
const fs       = require('fs');
const path     = require('path');
const axios    = require('axios');
const FormData = require('form-data');

/* ─── Configuration ──────────────────────────────────────────────────────── */
const API_BASE       = 'https://api.nursesprep.fr/api';
const ADMIN_EMAIL    = 'admin@ifsi.fr';
const ADMIN_PASSWORD = 'Admin1234!';
const EXTRACTED_ROOT = path.join(require('os').tmpdir(), 'nursespep_extract', 'Nurses Prep');

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

function parseUE(f) { const m = f.match(/^(\d+\.\d+)/); return m ? m[1] : null; }
function parseSemester(s) { const m = s.match(/S(\d+)/i); return m ? `Semestre ${m[1]}` : ''; }
function cleanTitle(f) {
  return f.replace(/\.pdf$/i, '').replace(/\s*\(\d+\)\s*$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ─── Collecte des PDF ───────────────────────────────────────────────────── */
function collectPDFs(dir) {
  const list = [];
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.toLowerCase().endsWith('.pdf')) {
        const rel   = path.relative(dir, full);
        const parts = rel.split(path.sep);
        if (!parts.includes('Cours')) continue;
        const ci  = parts.indexOf('Cours');
        const sem = parts[ci + 1] || '';
        const ue  = parts[ci + 2] || '';
        const sub = parts[ci + 3] || '';
        if (sub.toLowerCase() === 'td') continue;
        const code = parseUE(ue);
        if (!code) continue;
        list.push({
          path:     full,
          filename: e.name,
          title:    cleanTitle(e.name),
          semester: parseSemester(sem),
          category: UE_MAP[code] || `UE ${code}`,
          tags:     [code, parseSemester(sem)].filter(Boolean),
        });
      }
    }
  }
  walk(dir);
  return list;
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
async function main() {
  // 1. Login
  console.log('Connexion admin…');
  const loginRes = await axios.post(`${API_BASE}/auth/login`, { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const token = loginRes.data.token;
  console.log('Token OK\n');

  // 2. Collecter les PDF
  const pdfs = collectPDFs(EXTRACTED_ROOT);
  console.log(`${pdfs.length} cours à importer\n`);

  let ok = 0, skip = 0, err = 0;

  for (const pdf of pdfs) {
    try {
      const form = new FormData();
      form.append('title',     pdf.title);
      form.append('type',      'cours');
      form.append('semester',  pdf.semester);
      form.append('category',  pdf.category);
      form.append('tags',      JSON.stringify(pdf.tags));
      form.append('difficulty','medium');
      form.append('isPublished','true');
      form.append('file',      fs.createReadStream(pdf.path), {
        filename:    pdf.filename,
        contentType: 'application/pdf',
      });

      await axios.post(`${API_BASE}/lessons`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
        maxContentLength: 50 * 1024 * 1024,
        maxBodyLength:    50 * 1024 * 1024,
        timeout:          60000,
      });

      console.log(`  ✓ [${pdf.semester}] ${pdf.category} — ${pdf.title}`);
      ok++;
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      if (msg?.includes('duplicate') || msg?.includes('déjà')) {
        console.log(`  ⊘ Doublon : ${pdf.title}`);
        skip++;
      } else {
        console.error(`  ✗ ERREUR ${pdf.title} : ${msg}`);
        err++;
      }
    }

    // Petite pause pour ne pas surcharger le serveur
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== RÉSULTAT ===`);
  console.log(`Importés : ${ok}`);
  console.log(`Doublons : ${skip}`);
  console.log(`Erreurs  : ${err}`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
