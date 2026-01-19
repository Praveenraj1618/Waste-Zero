// models/Pickup.js
const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: [{ type: String }],
  scheduled_time: { type: Date },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', PickupSchema);
