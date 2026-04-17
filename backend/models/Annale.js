const mongoose = require('mongoose');

const annaleSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  year:         { type: String, required: true, trim: true },  // ex: "2023-2024"
  semester:     { type: String, required: true, trim: true },  // ex: "Semestre 1"
  subject:      { type: String, required: true, trim: true },  // ex: "UE 2.4"
  description:  { type: String, default: '' },
  // File attachment
  fileData:     { type: Buffer },
  fileMimeType: { type: String, default: '' },
  fileName:     { type: String, default: '' },
  fileSize:     { type: Number, default: 0 },
  hasFile:      { type: Boolean, default: false },
  isPublished:  { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Annale', annaleSchema);
