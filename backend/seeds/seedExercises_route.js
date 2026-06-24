/**
 * Route admin : POST /api/admin/seed-exercises-s1
 * Insère les exercices Semestre 1 UE 1.1 en base
 */
const Exercise = require('../models/Exercise');
const exercises = require('./seedExercises_S1_UE1_1');

module.exports = async (req, res) => {
  try {
    // Évite les doublons sur le titre
    let inserted = 0;
    for (const ex of exercises) {
      const exists = await Exercise.findOne({ title: ex.title });
      if (!exists) {
        await Exercise.create(ex);
        inserted++;
      }
    }
    res.json({ message: `${inserted} exercice(s) inséré(s) (${exercises.length - inserted} déjà présent(s)).` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
