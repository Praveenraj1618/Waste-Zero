// models/AdminLog.js
const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String },
  target_id: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
