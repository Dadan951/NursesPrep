/**
 * seedSemestre1.js — Insertion des quiz du Semestre 1 IFSI en base MongoDB
 *
 * Usage :  node seeds/seedSemestre1.js
 *
 * ⚠️  Lance ce script depuis le dossier backend/ :
 *      cd C:\ifsi-app\backend && node seeds/seedSemestre1.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Quiz     = require('../models/Quiz');

const part1 = require('./quizSemestre1_part1');
const part2 = require('./quizSemestre1_part2');
const part3 = require('./quizSemestre1_part3');
const part4 = require('./quizSemestre1_part4');
const part5 = require('./quizSemestre1_part5');

const ALL_QUIZZES = [...part1, ...part2, ...part3, ...part4, ...part5];

const URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function seed() {
  if (!URI) {
    console.error('❌  MONGO_URI manquant dans le fichier .env');
    process.exit(1);
  }

  console.log('🔌  Connexion à MongoDB…');
  await mongoose.connect(URI);
  console.log('✅  Connecté');

  // Supprime uniquement les quiz officiels du Semestre 1 (pas les quiz personnels)
  const deleted = await Quiz.deleteMany({ semester: 'Semestre 1', isPersonal: false });
  console.log(`🗑️   ${deleted.deletedCount} anciens quiz S1 supprimés`);

  // Insertion
  const inserted = await Quiz.insertMany(ALL_QUIZZES);
  console.log(`✅  ${inserted.length} quiz insérés avec succès`);

  // Résumé par UE
  const byUE = {};
  for (const q of inserted) {
    byUE[q.category] = (byUE[q.category] || 0) + 1;
  }
  console.log('\n📊  Répartition par UE :');
  for (const [ue, count] of Object.entries(byUE)) {
    const totalQ = ALL_QUIZZES
      .filter(q => q.category === ue)
      .reduce((acc, q) => acc + q.questions.length, 0);
    console.log(`   • ${ue} → ${count} quiz (${totalQ} questions)`);
  }

  const totalQuestions = ALL_QUIZZES.reduce((acc, q) => acc + q.questions.length, 0);
  console.log(`\n📝  Total : ${inserted.length} quiz — ${totalQuestions} questions`);

  await mongoose.disconnect();
  console.log('\n🔌  Déconnecté. Terminé avec succès ! 🎉');
}

seed().catch(err => {
  console.error('❌  Erreur :', err.message);
  process.exit(1);
});
