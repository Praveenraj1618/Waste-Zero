// routes/pickups.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const Pickup = require('../models/Pickup');

router.post('/', auth, [body('category').notEmpty()], validate, async (req, res) => {
  try {
    const { category, scheduled_time, notes } = req.body;
    const p = await Pickup.create({
      user_id: req.user.id,
      category: Array.isArray(category) ? category : [String(category)],
      scheduled_time,
      notes
    });
    res.status(201).json(p);
  } catch (err) {
    console.error('Create pickup', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (['admin', 'ngo', 'pickup_agent'].includes(req.user.role)) {
      const list = await Pickup.find().populate('user_id', 'name email').sort('-createdAt');
      return res.json(list);
    }
    const list = await Pickup.find({ user_id: req.user.id }).sort('-createdAt');
    res.json(list);
  } catch (err) {
    console.error('List pickups', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const { status, agent_id } = req.body;
    const p = await Pickup.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Pickup not found' });

    // allow admin or agent to change
    if (agent_id) p.agent_id = agent_id;
    if (status) p.status = status;
    await p.save();
    res.json(p);
  } catch (err) {
    console.error('Update pickup', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
