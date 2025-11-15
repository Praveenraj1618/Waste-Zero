// routes/analytics.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

router.get('/user-activity', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const since = new Date(); since.setDate(since.getDate() - days);
    const agg = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error('user-activity', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/opportunity-engagement', auth, async (req, res) => {
  try {
    const totalOpps = await Opportunity.countDocuments();
    const totalApps = await Application.countDocuments();
    res.json({ totalOpps, totalApps });
  } catch (err) {
    console.error('opportunity-engagement', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
