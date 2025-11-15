// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'ngo', 'admin', 'pickup_agent'], default: 'volunteer' },
  skills: [{ type: String }],
  location: { type: String },
  bio: { type: String },
  suspended: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
