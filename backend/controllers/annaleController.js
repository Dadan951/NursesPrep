const Annale = require('../models/Annale');

// ── Student routes ──────────────────────────────────────────────────────────

exports.getAll = async (req, res) => {
  try {
    const annales = await Annale.find({ isPublished: true })
      .select('-fileData')
      .sort({ year: -1, semester: 1, subject: 1, createdAt: -1 });
    res.json(annales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const annale = await Annale.findById(req.params.id).select('-fileData');
    if (!annale || !annale.isPublished) return res.status(404).json({ message: 'Annale introuvable' });
    res.json(annale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public file download (no auth — published content only)
exports.downloadFile = async (req, res) => {
  try {
    const annale = await Annale.findOne({ _id: req.params.id, isPublished: true, hasFile: true })
      .select('fileData fileMimeType fileName');
    if (!annale) return res.status(404).json({ message: 'Fichier introuvable' });
    res.set('Content-Type', annale.fileMimeType);
    res.set('Content-Disposition', `inline; filename="${encodeURIComponent(annale.fileName)}"`);
    res.send(annale.fileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin routes ────────────────────────────────────────────────────────────

exports.adminGetAll = async (req, res) => {
  try {
    const annales = await Annale.find()
      .select('-fileData')
      .sort({ year: -1, semester: 1, subject: 1, createdAt: -1 });
    res.json(annales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isPublished !== undefined) {
      data.isPublished = data.isPublished === 'true' || data.isPublished === true;
    }
    if (req.file) {
      data.fileData     = req.file.buffer;
      data.fileMimeType = req.file.mimetype;
      data.fileName     = req.file.originalname;
      data.fileSize     = req.file.size;
      data.hasFile      = true;
    }
    const annale = await Annale.create(data);
    const plain = annale.toObject();
    delete plain.fileData;
    res.status(201).json(plain);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isPublished !== undefined) {
      data.isPublished = data.isPublished === 'true' || data.isPublished === true;
    }

    let updateOp;
    if (req.body.removeFile === 'true' && !req.file) {
      updateOp = {
        $set:   { ...data, hasFile: false, fileMimeType: '', fileName: '', fileSize: 0 },
        $unset: { fileData: 1 },
      };
    } else {
      if (req.file) {
        data.fileData     = req.file.buffer;
        data.fileMimeType = req.file.mimetype;
        data.fileName     = req.file.originalname;
        data.fileSize     = req.file.size;
        data.hasFile      = true;
      }
      updateOp = { $set: data };
    }

    const annale = await Annale.findByIdAndUpdate(req.params.id, updateOp, { new: true })
      .select('-fileData');
    if (!annale) return res.status(404).json({ message: 'Annale introuvable' });
    res.json(annale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Annale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annale supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
