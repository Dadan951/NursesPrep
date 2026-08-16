const mongoose = require('mongoose');

const lessonTreatmentItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  note: { type: String, default: '' },
}, { _id: false });

// One ordered array of sections, each rendered differently by "kind":
// - "text": markdown-like content rendered like Drug.sections (DÉFINITION, PHYSIOPATHOLOGIE, ...)
// - "treatments": clickable items linking to the médicaments tab (TRAITEMENT)
// - "essentials": bullet-point recap card (L'ESSENTIEL À RETENIR)
const lessonSectionSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  kind:       { type: String, enum: ['text', 'treatments', 'essentials'], default: 'text' },
  content:    { type: String, default: '' },                    // kind: text
  treatments: { type: [lessonTreatmentItemSchema], default: [] }, // kind: treatments
  items:      { type: [String], default: [] },                  // kind: essentials
  order:      { type: Number, default: 0 },
}, { _id: true });

const lessonSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  type:       { type: String, enum: ['cours', 'fiche'], default: 'cours' },
  content:    { type: String, default: '' },        // text content (optional if file attached)
  summary:    { type: String, default: '' },
  // Structured course content (same pattern as Drug.sections) — powers the rich CoursDetail page
  sections:   { type: [lessonSectionSchema], default: [] },
  semester:   { type: String, default: '', trim: true },
  programVersion: { type: String, enum: ['ancien', 'reforme_2026'], default: 'ancien' },
  category:   { type: String, required: true, trim: true },
  chapter:    { type: String, default: '', trim: true },
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
