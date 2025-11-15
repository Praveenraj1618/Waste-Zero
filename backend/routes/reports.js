// routes/reports.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Pickup = require('../models/Pickup');
const WasteStats = require('../models/WasteStats');

router.get('/full-report', auth, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const oppCount = await Opportunity.countDocuments();
    const appsCount = await Application.countDocuments();
    const pickupsCount = await Pickup.countDocuments();
    const wasteTotal = await WasteStats.aggregate([{ $group: { _id: null, totalWeight: { $sum: '$weight' } } }]);

    res.json({
      usersCount, oppCount, appsCount, pickupsCount,
      totalWasteKg: wasteTotal[0]?.totalWeight || 0,
      generatedAt: new Date()
    });
  } catch (err) {
    console.error('full-report', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
