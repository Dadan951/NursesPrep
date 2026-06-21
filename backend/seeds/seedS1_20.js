// ── 20 quiz par UE — Semestre 1 IFSI ─────────────────────────────────────────
const Quiz = require('../models/Quiz');

const ALL_S1_20 = [
  // UE 1.1 — Psychologie, sociologie, anthropologie (20 quiz)
  ...require('./quiz20_S1_UE1_1_A'),
  ...require('./quiz20_S1_UE1_1_B'),
  ...require('./quiz20_S1_UE1_1_C'),
  ...require('./quiz20_S1_UE1_1_D'),
  // UE 1.3 — Législation, éthique, déontologie (20 quiz)
  ...require('./quiz20_S1_UE1_3_A'),
  ...require('./quiz20_S1_UE1_3_B'),
  ...require('./quiz20_S1_UE1_3_C'),
  ...require('./quiz20_S1_UE1_3_D'),
  // UE 2.1 — Biologie fondamentale (20 quiz)
  ...require('./quiz20_S1_UE2_1'),
  // UE 2.2 — Cycles de la vie et grandes fonctions (20 quiz)
  ...require('./quiz20_S1_UE2_2_A'),
  ...require('./quiz20_S1_UE2_2_B'),
  ...require('./quiz20_S1_UE2_2_C'),
  ...require('./quiz20_S1_UE2_2_D'),
  // UE 2.10 — Infectiologie et hygiène (20 quiz)
  ...require('./quiz20_S1_UE2_10_A'),
  ...require('./quiz20_S1_UE2_10_B'),
  ...require('./quiz20_S1_UE2_10_C'),
  ...require('./quiz20_S1_UE2_10_D'),
  // UE 2.11 — Pharmacologie et thérapeutiques (20 quiz)
  ...require('./quiz20_S1_UE2_11_A'),
  ...require('./quiz20_S1_UE2_11_B'),
  ...require('./quiz20_S1_UE2_11_C'),
  ...require('./quiz20_S1_UE2_11_D'),
  // UE 3.1 — Raisonnement et démarche clinique (20 quiz)
  ...require('./quiz20_S1_UE3_1_A'),
  ...require('./quiz20_S1_UE3_1_B'),
  ...require('./quiz20_S1_UE3_1_C'),
  ...require('./quiz20_S1_UE3_1_D'),
  // UE 4.1 — Soins de confort et de relation (20 quiz)
  ...require('./quiz20_S1_UE4_1_A'),
  ...require('./quiz20_S1_UE4_1_B'),
  ...require('./quiz20_S1_UE4_1_C'),
  ...require('./quiz20_S1_UE4_1_D'),
  // UE 6.1 — Méthodes de travail et TIC (20 quiz)
  ...require('./quiz20_S1_UE6_1_A'),
  ...require('./quiz20_S1_UE6_1_B'),
  ...require('./quiz20_S1_UE6_1_C'),
  ...require('./quiz20_S1_UE6_1_D'),
];

async function seedS1_20() {
  let inserted = 0;
  let updated = 0;
  for (const quiz of ALL_S1_20) {
    const result = await Quiz.findOneAndUpdate(
      { title: quiz.title, category: quiz.category },
      { $set: { chapter: quiz.chapter, difficulty: quiz.difficulty, questions: quiz.questions } },
      { upsert: true, new: true }
    );
    if (result.__v === undefined || result.isNew) inserted++;
    else updated++;
  }
  console.log(`[seedS1_20] ✅ ${inserted} insérés, ${updated} mis à jour (total: ${ALL_S1_20.length})`);
  return { inserted, updated, total: ALL_S1_20.length };
}

module.exports = { seedS1_20, count: ALL_S1_20.length };
