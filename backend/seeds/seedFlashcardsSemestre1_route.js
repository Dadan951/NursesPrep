/**
 * Route admin : POST /api/admin/seed-flashcards-s1
 * Lance l'insertion des flashcards Semestre 1 depuis le serveur
 * (protégée par adminOnly — appel unique puis à supprimer)
 */
const Flashcard = require('../models/Flashcard');

const part1 = require('./flashcardsSemestre1_part1');
const part2 = require('./flashcardsSemestre1_part2');
const part3 = require('./flashcardsSemestre1_part3');

const ALL_FLASHCARDS = [...part1, ...part2, ...part3];

module.exports = async (req, res) => {
  try {
    const deleted = await Flashcard.deleteMany({ semester: 'Semestre 1', isPersonal: { $ne: true } });

    const inserted = await Flashcard.insertMany(ALL_FLASHCARDS);

    const byUE = {};
    for (const f of inserted) {
      byUE[f.category] = (byUE[f.category] || 0) + 1;
    }

    res.json({
      success: true,
      deleted: deleted.deletedCount,
      inserted: inserted.length,
      byUE,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
