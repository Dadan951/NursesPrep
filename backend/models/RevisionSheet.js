const mongoose = require('mongoose');

const revisionSheetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  rawText: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }, // generated JSON
  colorScheme: { type: String, default: 'blue' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RevisionSheet', revisionSheetSchema);
