// routes/opportunities.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const upload = require('../middleware/upload');

const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

/**
 * Helper: parse requiredSkills input (accepts JSON array or comma-separated string)
 */
function parseSkills(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(s => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    try {
      const maybe = JSON.parse(input);
      if (Array.isArray(maybe)) return maybe.map(s => String(s).trim()).filter(Boolean);
    } catch (e) {
      // not JSON, fallback to comma-split
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/**
 * POST /api/opportunities
 * Create new opportunity
 * Protected: only ngo or admin
 * Accepts multipart/form-data with optional file field 'opportunityImage'
 */
router.post(
  '/',
  auth,
  upload.single('opportunityImage'),
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('description', 'Description is required').trim().notEmpty(),
    body('location').optional().isString(),
    body('date').optional().isISO8601().toDate(),
    body('duration').optional().isString(),
    body('requiredSkills').optional()
  ],
  validate,
  async (req, res) => {
    try {
      // role check
      if (req.user.role !== 'ngo' && req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Only NGOs or admins can create opportunities' });

      const payload = req.body;
      const requiredSkills = parseSkills(payload.requiredSkills);

      const opportunity = new Opportunity({
        title: payload.title,
        description: payload.description,
        organization: req.user.id,
        location: payload.location,
        date: payload.date || undefined,
        duration: payload.duration,
        requiredSkills,
        imageUrl: req.file ? `/${req.file.path.replace(/\\/g, '/')}` : undefined
      });

      await opportunity.save();
      const populated = await opportunity.populate('organization', 'name email');
      res.status(201).json(populated);
    } catch (err) {
      console.error('Create Opportunity Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * GET /api/opportunities
 * Query params: ?q=searchString&location=...&skill=skillName&page=1&limit=20
 */
router.get(
  '/',
  [
    query('q').optional().isString(),
    query('location').optional().isString(),
    query('skill').optional().isString(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validate,
  async (req, res) => {
    try {
      const { q, location, skill } = req.query;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;

      const filter = {};
      if (q) filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (skill) filter.requiredSkills = { $in: [skill] };
      filter.status = { $ne: 'closed' }; // default: exclude closed unless explicit

      const total = await Opportunity.countDocuments(filter);
      const list = await Opportunity.find(filter)
        .populate('organization', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({ meta: { total, page, limit }, data: list });
    } catch (err) {
      console.error('List Opportunities Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * GET /api/opportunities/:id
 */
router.get(
  '/:id',
  [param('id', 'Invalid opportunity id').isMongoId()],
  validate,
  async (req, res) => {
    try {
      const opp = await Opportunity.findById(req.params.id).populate('organization', 'name email skills');
      if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
      res.json(opp);
    } catch (err) {
      console.error('Get Opportunity Error:', err);
      if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Opportunity not found' });
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * PUT /api/opportunities/:id
 * Update opportunity (auth + ownership)
 * NGO who created it or admin can update
 */
router.put(
  '/:id',
  auth,
  upload.single('opportunityImage'),
  [
    param('id', 'Invalid opportunity id').isMongoId(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('location').optional().isString(),
    body('date').optional().isISO8601().toDate(),
    body('duration').optional().isString(),
    body('requiredSkills').optional(),
    body('status').optional().isIn(['open', 'closed', 'in-progress'])
  ],
  validate,
  async (req, res) => {
    try {
      const opp = await Opportunity.findById(req.params.id);
      if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });

      if (String(opp.organization) !== req.user.id && req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Not authorized' });

      const updates = {};
      const body = req.body;

      if (body.title) updates.title = body.title;
      if (body.description) updates.description = body.description;
      if (body.location) updates.location = body.location;
      if (body.date) updates.date = body.date;
      if (body.duration) updates.duration = body.duration;
      if (body.requiredSkills) updates.requiredSkills = parseSkills(body.requiredSkills);
      if (body.status) updates.status = body.status;
      if (req.file) updates.imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

      const updated = await Opportunity.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('organization', 'name email');
      res.json(updated);
    } catch (err) {
      console.error('Update Opportunity Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * DELETE /api/opportunities/:id
 * Delete opportunity (auth + ownership)
 */
router.delete(
  '/:id',
  auth,
  [param('id', 'Invalid opportunity id').isMongoId()],
  validate,
  async (req, res) => {
    try {
      const opp = await Opportunity.findById(req.params.id);
      if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });

      if (String(opp.organization) !== req.user.id && req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Not authorized' });

      await opp.remove();
      res.json({ msg: 'Opportunity deleted' });
    } catch (err) {
      console.error('Delete Opportunity Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * PUT /api/opportunities/:id/join
 * Volunteer joins an opportunity (protected)
 */
router.put(
  '/:id/join',
  auth,
  [param('id', 'Invalid opportunity id').isMongoId()],
  validate,
  async (req, res) => {
    try {
      if (req.user.role === 'ngo') return res.status(400).json({ msg: 'NGO cannot join an opportunity as volunteer' });

      const opp = await Opportunity.findById(req.params.id);
      if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });

      if (!opp.volunteers.map(v => String(v)).includes(String(req.user.id))) {
        opp.volunteers.push(req.user.id);
        await opp.save();
      }

      res.json(opp);
    } catch (err) {
      console.error('Join Opportunity Error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
