const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  type:       { type: String, enum: ['cours', 'fiche'], default: 'cours' },
  content:    { type: String, default: '' },        // text content (optional if file attached)
  summary:    { type: String, default: '' },
  semester:   { type: String, default: '' },
  category:   { type: String, required: true },
  chapter:    { type: String, default: '' },
  tags:       [{ type: String }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isPublished:{ type: Boolean, default: true },
  // Optional file attachment (PDF, image, doc, etc.)
  fileData:   { type: Buffer },
  fileMimeType:{ type: String, default: '' },
  fileName:   { type: String, default: '' },
  fileSize:   { type: Number, default: 0 },
  hasFile:    { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lesson', lessonSchema);
