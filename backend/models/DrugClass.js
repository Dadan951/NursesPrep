const mongoose = require('mongoose');

const drugClassSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  color:       { type: String, default: '#0891b2' },
  icon:        { type: String, default: '💊' },
}, { timestamps: true });

module.exports = mongoose.model('DrugClass', drugClassSchema);
