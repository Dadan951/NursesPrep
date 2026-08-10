const Lesson = require('../models/Lesson');

// Parse multipart/form-data body fields into proper JS types
function parseBody(body, file) {
  const data = { ...body };

  // Tags: sent as JSON string or comma-separated
  if (data.tags && typeof data.tags === 'string') {
    try { data.tags = JSON.parse(data.tags); }
    catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
  }

  // Boolean fields come as strings from FormData
  if (data.isPublished !== undefined) {
    data.isPublished = data.isPublished === 'true' || data.isPublished === true;
  }

  // Attach file if provided
  if (file) {
    data.fileData    = file.buffer;
    data.fileMimeType = file.mimetype;
    data.fileName    = file.originalname;
    data.fileSize    = file.size;
    data.hasFile     = true;
  }

  return data;
}

// ── Student routes ──────────────────────────────────────────────────────────

exports.getAll = async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.query.type) filter.type = req.query.type;
    const lessons = await Lesson.find(filter)
      .select('-content -fileData')
      .sort('-createdAt');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select('-fileData');
    if (!lesson || !lesson.isPublished) return res.status(404).json({ message: 'Cours introuvable' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public file download — no auth required (published content only)
exports.downloadFile = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ _id: req.params.id, isPublished: true, hasFile: true })
      .select('fileData fileMimeType fileName');
    if (!lesson) return res.status(404).json({ message: 'Fichier introuvable' });
    res.set('Content-Type', lesson.fileMimeType);
    res.set('Content-Disposition', `inline; filename="${encodeURIComponent(lesson.fileName)}"`);
    res.send(lesson.fileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin routes ────────────────────────────────────────────────────────────

exports.adminGetAll = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .select('-fileData -content')
      .sort('-createdAt');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetOne = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select('-fileData');
    if (!lesson) return res.status(404).json({ message: 'Cours introuvable' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = parseBody(req.body, req.file);
    const lesson = await Lesson.create(data);
    const plain = lesson.toObject();
    delete plain.fileData;
    res.status(201).json(plain);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = parseBody(req.body, req.file);
    let updateOp;

    if (req.body.removeFile === 'true' && !req.file) {
      // Explicitly remove the file
      updateOp = {
        $set:   { ...data, hasFile: false, fileMimeType: '', fileName: '', fileSize: 0 },
        $unset: { fileData: 1 },
      };
    } else {
      updateOp = { $set: data };
    }

    const lesson = await Lesson.findByIdAndUpdate(req.params.id, updateOp, { new: true })
      .select('-fileData');
    if (!lesson) return res.status(404).json({ message: 'Cours introuvable' });
    res.json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
