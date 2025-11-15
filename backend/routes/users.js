// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, param } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const User = require('../models/User');

/**
 * POST /api/users
 * Signup - validated
 */
router.post(
  '/',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    body('role').optional().isIn(['volunteer', 'ngo', 'admin', 'pickup_agent']).withMessage('Invalid role'),
    body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
    body('location').optional().isString(),
    body('bio').optional().isString()
  ],
  validate,
  async (req, res) => {
    const { name, email, password, role, skills, location, bio } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      user = new User({ name, email, password, role, skills, location, bio });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * GET /api/users/:id - public profile
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).send('Server error');
  }
});

/**
 * PUT /api/users/:id - update profile (protected)
 * - only self or admin can update
 */
router.put(
  '/:id',
  auth,
  [
    param('id', 'Invalid user id').isMongoId(),
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['volunteer', 'ngo', 'admin', 'pickup_agent']),
    body('skills').optional().isArray(),
    body('location').optional().isString(),
    body('bio').optional().isString()
  ],
  validate,
  async (req, res) => {
    try {
      // authorization check
      if (req.user.id !== req.params.id && req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Not authorized' });

      const updates = { ...req.body };

      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      const user = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ msg: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
