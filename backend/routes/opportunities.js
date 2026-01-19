// routes/opportunities.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const upload = require('../middleware/upload');

const Opportunity = require('../models/Opportunity');

function parseSkills(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(s => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(s => String(s).trim()).filter(Boolean);
    } catch (e) {
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

router.post(
  '/',
  auth,
  upload.single('opportunityImage'),
  [
    body('title', 'Title required').trim().notEmpty(),
    body('description', 'Description required').trim().notEmpty(),
    body('date').optional().isISO8601().toDate(),
    body('requiredSkills').optional()
  ],
  validate,
  async (req, res) => {
    try {
      if (req.user.role !== 'ngo' && req.user.role !== 'admin') return res.status(403).json({ msg: 'Only NGOs/admins can create' });

      const sk = parseSkills(req.body.requiredSkills);
      const opp = new Opportunity({
        title: req.body.title,
        description: req.body.description,
        organization: req.user.id,
        location: req.body.location,
        date: req.body.date || undefined,
        duration: req.body.duration,
        requiredSkills: sk,
        imageUrl: req.file ? `/${req.file.path.replace(/\\/g, '/')}` : undefined
      });
      await opp.save();
      await opp.populate('organization', 'name email');
      res.status(201).json(opp);
    } catch (err) {
      console.error('Create opportunity', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.get(
  '/',
  [
    query('q').optional().isString(),
    query('location').optional().isString(),
    query('skill').optional().isString(),
    query('page').optional().toInt(),
    query('limit').optional().toInt()
  ],
  validate,
  async (req, res) => {
    try {
      const q = req.query.q, location = req.query.location, skill = req.query.skill;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const filter = {};
      if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (skill) filter.requiredSkills = { $in: [skill] };
      filter.status = { $ne: 'closed' };

      const total = await Opportunity.countDocuments(filter);
      const data = await Opportunity.find(filter)
        .populate('organization', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({ meta: { total, page, limit }, data });
    } catch (err) {
      console.error('List opportunities', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.get('/:id', [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('organization', 'name email skills');
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
    res.json(opp);
  } catch (err) {
    console.error('Get opportunity', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put(
  '/:id',
  auth,
  upload.single('opportunityImage'),
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('date').optional().isISO8601().toDate(),
    body('status').optional().isIn(['open', 'closed', 'in-progress']),
    body('requiredSkills').optional()
  ],
  validate,
  async (req, res) => {
    try {
      const opp = await Opportunity.findById(req.params.id);
      if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
      if (String(opp.organization) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

      const updates = {};
      const b = req.body;
      if (b.title) updates.title = b.title;
      if (b.description) updates.description = b.description;
      if (b.location) updates.location = b.location;
      if (b.date) updates.date = b.date;
      if (b.duration) updates.duration = b.duration;
      if (b.requiredSkills) updates.requiredSkills = parseSkills(b.requiredSkills);
      if (b.status) updates.status = b.status;
      if (req.file) updates.imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

      const updated = await Opportunity.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('organization', 'name email');
      res.json(updated);
    } catch (err) {
      console.error('Update opportunity', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.delete('/:id', auth, [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
    if (String(opp.organization) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    await opp.remove();
    res.json({ msg: 'Opportunity deleted' });
  } catch (err) {
    console.error('Delete opportunity', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id/join', auth, [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
    if (req.user.role === 'ngo') return res.status(400).json({ msg: 'NGO cannot join as volunteer' });
    if (!opp.volunteers.map(v => String(v)).includes(String(req.user.id))) {
      opp.volunteers.push(req.user.id);
      await opp.save();
    }
    res.json(opp);
  } catch (err) {
    console.error('Join opportunity', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
