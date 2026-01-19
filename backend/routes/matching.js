// routes/matching.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Opportunity = require('../models/Opportunity');

// GET /api/matching?location=...&skills=skill1,skill2
router.get('/', auth, async (req, res) => {
  try {
    const { location, skills } = req.query;
    const userSkills = skills ? skills.split(',').map(s => s.trim().toLowerCase()) : [];
    const userLocation = location ? location.toLowerCase() : '';

    // Fetch open opportunities
    const opportunities = await Opportunity.find({ status: 'open' }).populate('organization', 'name email');

    // Calculate scores
    const scored = opportunities.map(opp => {
      let score = 0;

      // Skill overlap
      if (opp.requiredSkills && opp.requiredSkills.length > 0) {
        const oppSkills = opp.requiredSkills.map(s => s.toLowerCase());
        const overlap = oppSkills.filter(s => userSkills.includes(s)).length;
        score += (overlap / oppSkills.length) * 50; // Up to 50 points for skills
      }

      // Location match (simple string check for now)
      if (userLocation && opp.location && opp.location.toLowerCase().includes(userLocation)) {
        score += 30;
      } else if (userLocation && opp.location && userLocation.includes(opp.location.toLowerCase())) {
        score += 30;
      }

      // Recency boost
      const daysOld = (new Date() - new Date(opp.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysOld < 7) score += 20;
      else if (daysOld < 30) score += 10;

      return { ...opp.toObject(), matchScore: Math.round(score) };
    });

    // Sort by score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json(scored.slice(0, 20)); // Return top 20
  } catch (err) {
    console.error('Matching error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
