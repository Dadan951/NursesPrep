'use strict';
const path              = require('path');
const seedCoursFromFiles = require('./seedCoursFromFiles');

// Chemin du dossier extrait (à adapter si nécessaire)
const EXTRACTED_ROOT = path.join(
  require('os').tmpdir(),
  'nursespep_extract'
);

module.exports = async (req, res) => {
  try {
    console.log('[Seed Cours] Démarrage depuis', EXTRACTED_ROOT);
    const results = await seedCoursFromFiles(EXTRACTED_ROOT);
    res.json({
      ok: true,
      message: `${results.inserted} cours importés, ${results.skipped} déjà présents`,
      inserted: results.inserted,
      skipped:  results.skipped,
      errors:   results.errors,
    });
  } catch (err) {
    console.error('[Seed Cours]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
