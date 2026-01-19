// middleware/adminAuth.js
const auth = require('./auth');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // use auth first to populate req.user
  auth(req, res, async () => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
      next();
    } catch (err) {
      console.error('adminAuth error', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};
