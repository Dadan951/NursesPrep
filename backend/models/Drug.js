const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, default: '' },
  order:   { type: Number, default: 0 },
}, { _id: true });

const attachmentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  url:  { type: String, required: true },
  type: { type: String, enum: ['image', 'pdf', 'video', 'other'], default: 'other' },
}, { _id: true });

const sourceSchema = new mongoose.Schema({
  title:   { type: String, default: '' },
  authors: { type: String, default: '' },
  year:    { type: String, default: '' },
  url:     { type: String, default: '' },
}, { _id: true });

const drugSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  genericName: { type: String, default: '' },
  drugClass:   { type: mongoose.Schema.Types.ObjectId, ref: 'DrugClass', required: true },
  description: { type: String, default: '' },
  sections:    { type: [sectionSchema], default: [] },
  mindMap:     {
    url:     { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  attachments: { type: [attachmentSchema], default: [] },
  sources:     { type: [sourceSchema], default: [] },
  tags:        { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Drug', drugSchema);
