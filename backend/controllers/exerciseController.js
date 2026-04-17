const Exercise = require('../models/Exercise');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const exercises = await Exercise.find({ isPublished: true });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const ex = await Exercise.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exercice introuvable' });
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
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'progress.exercisesCompleted': 1 },
      $set: { 'progress.lastActivity': new Date() }
    });
    res.json({ message: 'Exercice complété' });
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
