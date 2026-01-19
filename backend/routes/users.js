// routes/users.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const User = require('../models/User');

router.post(
  '/',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be 6+ chars').isLength({ min: 6 }),
    body('role').optional().isIn(['volunteer', 'ngo', 'admin', 'pickup_agent']),
    body('skills').optional().isArray()
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, role, skills, location, bio } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      user = new User({ name, email, password, role, skills, location, bio });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
      console.error('Signup error', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ msg: 'User not found' });
    res.json(u);
  } catch (err) {
    console.error('Get user', err);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put(
  '/:id',
  auth,
  [
    param('id', 'Invalid id').isMongoId(),
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['volunteer', 'ngo', 'admin', 'pickup_agent']),
    body('skills').optional().isArray()
  ],
  validate,
  async (req, res) => {
    try {
      if (req.user.id !== req.params.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
      const updates = { ...req.body };
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }
      const updated = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select('-password');
      if (!updated) return res.status(404).json({ msg: 'User not found' });
      res.json(updated);
    } catch (err) {
      console.error('Update user', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// GET /profile - Get current user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Get profile - req.user:', req.user);
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /profile - Update current user's profile
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('skills').optional().isArray(),
  body('location').optional(),
  body('bio').optional()
], validate, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    const updated = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ msg: 'User not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update profile error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
