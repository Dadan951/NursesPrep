const UserFile = require('../models/UserFile');

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const TYPE_LABELS = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/jpg': 'Image', 'image/webp': 'Image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'text/plain': 'Texte'
};

exports.getFiles = async (req, res) => {
  try {
    const files = await UserFile.find({ owner: req.user._id })
      .select('-data')
      .sort('-createdAt');
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni' });
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Type de fichier non autorisé (PDF, image, Word, texte uniquement)' });
    }
    if (req.file.size > 8 * 1024 * 1024) {
      return res.status(400).json({ message: 'Fichier trop volumineux (max 8 Mo)' });
    }

    const file = await UserFile.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      category: req.body.category || '',
      owner: req.user._id
    });

    res.status(201).json({
      _id: file._id,
      name: file.name,
      originalName: file.originalName,
      mimetype: file.mimetype,
      typeLabel: TYPE_LABELS[file.mimetype] || 'Fichier',
      size: file.size,
      category: file.category,
      createdAt: file.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.download = async (req, res) => {
  try {
    const file = await UserFile.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'Fichier introuvable' });

    res.set('Content-Type', file.mimetype);
    res.set('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await UserFile.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'Fichier introuvable' });
    res.json({ message: 'Fichier supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
