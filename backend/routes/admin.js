// routes/admin.js
const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const AdminLog = require('../models/AdminLog');

router.get('/users', adminAuth, async (req, res) => {
  try {
    const list = await User.find().select('-password');
    res.json(list);
  } catch (err) {
    console.error('Admin get users', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.suspended = true;
    await user.save();
    await AdminLog.create({ admin_id: req.user.id, action: 'suspended_user', target_id: id });
    res.json({ msg: 'User suspended' });
  } catch (err) {
    console.error('Suspend user', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/opportunities/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await Opportunity.findByIdAndDelete(id);
    await AdminLog.create({ admin_id: req.user.id, action: 'deleted_opportunity', target_id: id });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('Admin delete opp', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/logs', adminAuth, async (req, res) => {
  try {
    const logs = await AdminLog.find().sort('-timestamp');
    res.json(logs);
  } catch (err) {
    console.error('Get logs', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
