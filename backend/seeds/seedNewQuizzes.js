// ── Index maître — tous les nouveaux quiz IFSI ────────────────────────────────
const Quiz = require('../models/Quiz');

const ALL_NEW_QUIZZES = [
  // Semestre 1
  ...require('./newQuiz_S1_UE1_1'),
  ...require('./newQuiz_S1_UE1_3'),
  ...require('./newQuiz_S1_UE2_1'),
  ...require('./newQuiz_S1_UE2_2'),
  ...require('./newQuiz_S1_UE2_10'),
  ...require('./newQuiz_S1_UE2_11'),
  ...require('./newQuiz_S1_UE3_1'),
  ...require('./newQuiz_S1_UE4_1'),
  ...require('./newQuiz_S1_UE6_1'),
  // Semestre 2
  ...require('./newQuiz_S2_UE1_2'),
  ...require('./newQuiz_S2_UE2_3'),
  ...require('./newQuiz_S2_UE2_5'),
  ...require('./newQuiz_S2_UE2_6'),
  ...require('./newQuiz_S2_UE3_3'),
  ...require('./newQuiz_S2_UE4_3'),
  ...require('./newQuiz_S2_UE4_4'),
  // Semestre 3
  ...require('./newQuiz_S3_UE2_4'),
  ...require('./newQuiz_S3_UE2_7'),
  ...require('./newQuiz_S3_UE2_8'),
  ...require('./newQuiz_S3_UE3_2'),
  ...require('./newQuiz_S3_UE4_2'),
  ...require('./newQuiz_S3_UE4_5'),
  ...require('./newQuiz_S3_UE4_6'),
  // Semestre 4
  ...require('./newQuiz_S4_UE2_9'),
  ...require('./newQuiz_S4_UE3_4'),
  ...require('./newQuiz_S4_UE4_7'),
  ...require('./newQuiz_S4_UE4_8'),
  // Semestre 5
  ...require('./newQuiz_S5_UE3_5'),
  ...require('./newQuiz_S5_UE6_2'),
];

async function seedNewQuizzes() {
  let inserted = 0;
  let skipped = 0;
  for (const quiz of ALL_NEW_QUIZZES) {
    const exists = await Quiz.findOne({ title: quiz.title, category: quiz.category });
    if (!exists) {
      await Quiz.create(quiz);
      inserted++;
    } else {
      skipped++;
    }
  }
  console.log(`[seedNewQuizzes] ✅ ${inserted} quiz insérés, ${skipped} déjà existants (total: ${ALL_NEW_QUIZZES.length})`);
  return { inserted, skipped, total: ALL_NEW_QUIZZES.length };
}

module.exports = { seedNewQuizzes, count: ALL_NEW_QUIZZES.length };
