// routes/auth.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const validate = require('../middleware/validator');

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists()
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
      if (user.suspended) return res.status(403).json({ msg: 'Account suspended' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('Login error', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
