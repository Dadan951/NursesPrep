/**
 * seedFlashcardsSemestre1.js — Insertion des flashcards du Semestre 1 IFSI
 *
 * Usage :  node seeds/seedFlashcardsSemestre1.js
 *
 * ⚠️  Lance ce script depuis le dossier backend/ :
 *      cd C:\ifsi-app\backend && node seeds/seedFlashcardsSemestre1.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose    = require('mongoose');
const Flashcard   = require('../models/Flashcard');

const part1 = require('./flashcardsSemestre1_part1');
const part2 = require('./flashcardsSemestre1_part2');
const part3 = require('./flashcardsSemestre1_part3');

const ALL_FLASHCARDS = [...part1, ...part2, ...part3];

const URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function seed() {
  if (!URI) {
    console.error('❌  MONGO_URI manquant dans le fichier .env');
    process.exit(1);
  }

  console.log('🔌  Connexion à MongoDB…');
  await mongoose.connect(URI);
  console.log('✅  Connecté');

  const deleted = await Flashcard.deleteMany({ semester: 'Semestre 1', isPersonal: { $ne: true } });
  console.log(`🗑️   ${deleted.deletedCount} anciennes flashcards S1 supprimées`);

  const inserted = await Flashcard.insertMany(ALL_FLASHCARDS);
  console.log(`✅  ${inserted.length} flashcards insérées avec succès`);

  const byUE = {};
  for (const f of inserted) {
    byUE[f.category] = (byUE[f.category] || 0) + 1;
  }
  console.log('\n📊  Répartition par UE :');
  for (const [ue, count] of Object.entries(byUE)) {
    console.log(`   • ${ue} → ${count} cartes`);
  }

  console.log(`\n📝  Total : ${inserted.length} flashcards`);

  await mongoose.disconnect();
  console.log('\n🔌  Déconnecté. Terminé avec succès ! 🎉');
}

seed().catch(err => {
  console.error('❌  Erreur :', err.message);
  process.exit(1);
});
