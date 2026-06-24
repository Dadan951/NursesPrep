const Flashcard        = require('../models/Flashcard');
const User             = require('../models/User');
const FlashcardAttempt = require('../models/FlashcardAttempt');

exports.getAll = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ isPublished: true });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const fc = await Flashcard.findById(req.params.id);
    if (!fc) return res.status(404).json({ message: 'Flashcard introuvable' });
    res.json(fc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const fc = await Flashcard.create(req.body);
    res.status(201).json(fc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const fc = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fc) return res.status(404).json({ message: 'Flashcard introuvable' });
    res.json(fc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const fc = await Flashcard.findByIdAndDelete(req.params.id);
    if (!fc) return res.status(404).json({ message: 'Flashcard introuvable' });
    res.json({ message: 'Flashcard supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markReviewed = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'progress.flashcardsReviewed': 1 },
      $set: { 'progress.lastActivity': new Date() }
    });
    res.json({ message: 'Progression mise à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/flashcards/attempts ─────────────────────────────────────────
// Tous les attempts de l'utilisateur (pour afficher les badges sur les chapitres)
exports.getAttempts = async (req, res) => {
  try {
    const attempts = await FlashcardAttempt.find({ user: req.user._id });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/flashcards/attempt?semester=&ue=&chapter= ────────────────────
// Attempt pour un chapitre précis
exports.getAttempt = async (req, res) => {
  try {
    const { semester, ue, chapter } = req.query;
    const attempt = await FlashcardAttempt.findOne({
      user: req.user._id, semester, ue, chapter
    });
    res.json(attempt || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/flashcards/attempt ───────────────────────────────────────────
// Sauvegarde la progression (après chaque carte)
exports.saveAttempt = async (req, res) => {
  try {
    const { semester, ue, chapter, currentIndex, known, unknown, total, unknownCards } = req.body;
    const attempt = await FlashcardAttempt.findOneAndUpdate(
      { user: req.user._id, semester, ue, chapter },
      { $set: { currentIndex, known, unknown, total, unknownCards, status: 'in_progress' } },
      { upsert: true, new: true }
    );
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/flashcards/attempt/complete ─────────────────────────────────
// Marque le chapitre comme terminé
exports.completeAttempt = async (req, res) => {
  try {
    const { semester, ue, chapter, known, unknown, total, unknownCards } = req.body;

    await FlashcardAttempt.findOneAndUpdate(
      { user: req.user._id, semester, ue, chapter },
      { $set: { status: 'completed', currentIndex: 0, known, unknown, total, unknownCards, completedAt: new Date() } },
      { upsert: true, new: true }
    );

    // Reset daily si nouveau jour
    const today = new Date().toISOString().split('T')[0];
    await User.updateOne(
      { _id: req.user._id, 'dailyProgress.date': { $ne: today } },
      { $set: { 'dailyProgress.date': today, 'dailyProgress.quiz': 0, 'dailyProgress.flashcards': 0, 'dailyProgress.exercises': 0 } }
    );

    // Mise à jour stats utilisateur + daily
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'progress.flashcardsReviewed': known, 'progress.flashcardsUnknown': unknown, 'dailyProgress.flashcards': known },
      $set: { 'progress.lastActivity': new Date() }
    });

    res.json({ message: 'Chapitre terminé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const FREE_FLASHCARD_LIMIT = 30;

exports.getQuota = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    if (user.subscription !== 'free') return res.json({ limited: false });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const attempts = await FlashcardAttempt.find({
      user: req.user._id,
      startedAt: { $gte: startOfMonth },
    }).select('known unknown');
    const used = attempts.reduce((sum, a) => sum + (a.known || 0) + (a.unknown || 0), 0);
    res.json({ limited: true, used, limit: FREE_FLASHCARD_LIMIT, exceeded: used >= FREE_FLASHCARD_LIMIT });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.adminGetAll = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
