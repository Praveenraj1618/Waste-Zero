// routes/matching.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Opportunity = require('../models/Opportunity');

// GET /api/matching?location=...&skills=skill1,skill2
router.get('/', auth, async (req, res) => {
  try {
    const { location, skills } = req.query;
    const q = { status: 'open' };
    if (location) q.location = { $regex: location, $options: 'i' };
    if (skills) q.requiredSkills = { $in: skills.split(',').map(s => s.trim()) };
    const matches = await Opportunity.find(q).limit(50).populate('organization', 'name email');
    res.json(matches);
  } catch (err) {
    console.error('Matching error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
