// routes/analytics.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Pickup = require('../models/Pickup');

router.get('/overview', auth, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const activeOpps = await Opportunity.countDocuments({ status: 'open' });
    const completedPickups = await Pickup.countDocuments({ status: 'completed' });

    res.json({
      users: { total: users },
      opportunities: { active: activeOpps },
      pickups: { completed: completedPickups }
    });
  } catch (err) {
    console.error('Analytics overview', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

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

router.get('/volunteer-engagement', auth, async (req, res) => {
  try {
    // Aggregate skills distribution for radar chart
    const skills = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    res.json(skills);
  } catch (err) {
    console.error('volunteer-engagement', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
