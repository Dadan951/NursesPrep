/**
 * Migration : backfill programVersion='ancien' sur tout le contenu existant
 * qui n'a pas encore ce champ (documents créés avant la réforme 2026).
 * Route : POST /api/admin/migrate-program-version-ancien
 * Usage unique — à exécuter avant d'activer le filtrage par programVersion
 * dans les contrôleurs (voir plan réforme 2026).
 */
const Quiz      = require('../models/Quiz');
const Lesson     = require('../models/Lesson');
const Flashcard  = require('../models/Flashcard');
const Exercise   = require('../models/Exercise');
const Annale     = require('../models/Annale');

module.exports = async (req, res) => {
  try {
    const filter = { programVersion: { $exists: false } };
    const set    = { $set: { programVersion: 'ancien' } };

    const [quiz, lesson, flashcard, exercise, annale] = await Promise.all([
      Quiz.updateMany(filter, set),
      Lesson.updateMany(filter, set),
      Flashcard.updateMany(filter, set),
      Exercise.updateMany(filter, set),
      Annale.updateMany(filter, set),
    ]);

    res.json({
      success: true,
      modifiedCount: {
        quiz: quiz.modifiedCount,
        lesson: lesson.modifiedCount,
        flashcard: flashcard.modifiedCount,
        exercise: exercise.modifiedCount,
        annale: annale.modifiedCount,
      },
    });
  } catch (err) {
    console.error('[migrateProgramVersionAncien]', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
