const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  description:    { type: String, default: '' },
  creator:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate:      { type: Boolean, default: false },
  joinCode:       { type: String, default: '' }, // always generated
  category:       { type: String, default: 'Général' },
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);
