// routes/notifications.js
const express = require('express');
const router = express.Router();
const { param } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const Notification = require('../models/Notification');

router.get('/', auth, async (req, res) => {
  try {
    const list = await Notification.find({ user_id: req.user.id }).sort('-sent_at');
    res.json(list);
  } catch (err) {
    console.error('Get notifications', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id/read', auth, [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ msg: 'Notification not found' });
    if (String(n.user_id) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    n.read = true;
    await n.save();
    res.json(n);
  } catch (err) {
    console.error('Mark read', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
