// models/WasteStats.js
const mongoose = require('mongoose');

const WasteStatsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup' },
  category: { type: String },
  weight: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WasteStats', WasteStatsSchema);
