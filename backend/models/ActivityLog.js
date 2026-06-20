const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userEmail: { type: String, default: '' },
  userName:  { type: String, default: '' },
  action:    { type: String, enum: ['login', 'logout', 'register', 'login_failed'], required: true },
  ip:        { type: String, default: '' },
  userAgent: { type: String, default: '' },
  device:    { type: String, default: '' },
  browser:   { type: String, default: '' },
  os:        { type: String, default: '' },
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
