/**
 * Route admin : POST /api/admin/seed-s1
 * Lance l'insertion des quiz Semestre 1 depuis le serveur Railway
 * (protégée par adminOnly — appel unique puis à supprimer)
 */
const Quiz   = require('../models/Quiz');
const User   = require('../models/User');
const part1  = require('./quizSemestre1_part1');
const part2  = require('./quizSemestre1_part2');
const part3  = require('./quizSemestre1_part3');
const part4  = require('./quizSemestre1_part4');
const part5  = require('./quizSemestre1_part5');
const part6  = require('./quizSemestre1_part6');
const part7  = require('./quizSemestre1_part7');
const part8  = require('./quizSemestre1_part8');

const ALL_QUIZZES = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7, ...part8];

module.exports = async (req, res) => {
  try {
    // Supprimer l'ancien compte admin par défaut (sécurité)
    const oldAdmin = await User.findOneAndDelete({ email: 'admin@ifsi.fr' });

    const deleted = await Quiz.deleteMany({ semester: 'Semestre 1', isPersonal: false });

    const inserted = await Quiz.insertMany(ALL_QUIZZES);

    const byUE = {};
    for (const q of inserted) {
      byUE[q.category] = (byUE[q.category] || 0) + 1;
    }

    const totalQuestions = ALL_QUIZZES.reduce((acc, q) => acc + q.questions.length, 0);

    res.json({
      success: true,
      oldAdminDeleted: !!oldAdmin,
      deleted: deleted.deletedCount,
      inserted: inserted.length,
      totalQuestions,
      byUE,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
