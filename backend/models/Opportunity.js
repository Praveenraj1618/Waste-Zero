// models/Opportunity.js
const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
  date: { type: Date },
  duration: { type: String },
  requiredSkills: [{ type: String }],
  status: { type: String, enum: ['open', 'closed', 'in-progress'], default: 'open' },
  imageUrl: { type: String },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
