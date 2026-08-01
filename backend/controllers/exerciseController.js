const Exercise = require('../models/Exercise');
const User = require('../models/User');
const ExerciseAttempt = require('../models/ExerciseAttempt');

const FREE_EXERCISE_LIMIT = 1;
const currentMonth = () => new Date().toISOString().slice(0, 7);

exports.getQuota = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription monthlyExercise');
    if (user.subscription !== 'free') return res.json({ limited: false });
    const month = currentMonth();
    const count = user.monthlyExercise?.month === month ? user.monthlyExercise.count : 0;
    res.json({ limited: true, used: count, limit: FREE_EXERCISE_LIMIT, exceeded: count >= FREE_EXERCISE_LIMIT });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      isPublished: true,
      programVersion: req.user.programVersion === 'reforme_2026' ? 'reforme_2026' : { $ne: 'reforme_2026' },
    });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const ex = await Exercise.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exercice introuvable' });
    if (req.user.programVersion === 'reforme_2026' && ex.programVersion !== 'reforme_2026')
      return res.status(404).json({ message: 'Exercice introuvable' });
    res.json(ex);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const ex = await Exercise.create(req.body);
    res.status(201).json(ex);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const ex = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ex) return res.status(404).json({ message: 'Exercice introuvable' });
    res.json(ex);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ex = await Exercise.findByIdAndDelete(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exercice introuvable' });
    res.json({ message: 'Exercice supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.complete = async (req, res) => {
  try {
    const { exerciseId, isCorrect } = req.body;
    const user = await User.findById(req.user._id).select('subscription monthlyExercise');

    // Vérifier quota mensuel pour les free
    if (user.subscription === 'free') {
      const month = currentMonth();
      const count = user.monthlyExercise?.month === month ? user.monthlyExercise.count : 0;
      if (count >= FREE_EXERCISE_LIMIT) {
        return res.status(403).json({ message: 'quota_exceeded' });
      }
      // Incrémenter le compteur mensuel
      const newCount = user.monthlyExercise?.month === month ? count + 1 : 1;
      await User.findByIdAndUpdate(req.user._id, {
        $set: { 'monthlyExercise.count': newCount, 'monthlyExercise.month': month }
      });
    }

    if (exerciseId) {
      await ExerciseAttempt.findOneAndUpdate(
        { user: req.user._id, exercise: exerciseId },
        { $set: { isCorrect: isCorrect === undefined ? null : isCorrect, completedAt: new Date() } },
        { upsert: true, new: true }
      );
    }

    // Reset daily si nouveau jour
    const today = new Date().toISOString().split('T')[0];
    await User.updateOne(
      { _id: req.user._id, 'dailyProgress.date': { $ne: today } },
      { $set: { 'dailyProgress.date': today, 'dailyProgress.quiz': 0, 'dailyProgress.flashcards': 0, 'dailyProgress.exercises': 0 } }
    );

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'progress.exercisesCompleted': 1, 'dailyProgress.exercises': 1 },
      $set: { 'progress.lastActivity': new Date() }
    });
    res.json({ message: 'Exercice complété' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/exercises/history ────────────────────────────────────────────
// Historique des exercices complétés par l'utilisateur
exports.getHistory = async (req, res) => {
  try {
    const attempts = await ExerciseAttempt.find({ user: req.user._id })
      .populate('exercise', 'title category semester type difficulty')
      .sort({ completedAt: -1 })
      .limit(200);

    const result = attempts
      .filter(a => a.exercise)
      .map(a => ({
        _id:         a._id,
        exerciseId:  a.exercise._id,
        title:       a.exercise.title,
        category:    a.exercise.category || '',
        chapter:     a.exercise.category || '',
        semester:    a.exercise.semester || '',
        difficulty:  a.exercise.difficulty || '',
        score:       a.isCorrect === false ? 0 : 1,
        total:       1,
        pct:         a.isCorrect === false ? 0 : 100,
        completedAt: a.completedAt,
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetAll = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
