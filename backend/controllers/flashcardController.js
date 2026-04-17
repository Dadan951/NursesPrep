const Flashcard = require('../models/Flashcard');
const User = require('../models/User');

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

exports.adminGetAll = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
