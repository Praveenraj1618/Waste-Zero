// routes/applications.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

router.post('/', auth, [body('opportunity_id', 'Invalid opportunity id').isMongoId()], validate, async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const opp = await Opportunity.findById(opportunity_id);
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });

    const exists = await Application.findOne({ opportunity_id, volunteer_id: req.user.id });
    if (exists) return res.status(400).json({ msg: 'Already applied' });

    const app = await Application.create({ opportunity_id, volunteer_id: req.user.id });
    res.status(201).json(app);
  } catch (err) {
    console.error('Apply error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:opportunityId', auth, [param('opportunityId').isMongoId()], validate, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.opportunityId);
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });
    if (String(opp.organization) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    const list = await Application.find({ opportunity_id: req.params.opportunityId }).populate('volunteer_id', 'name email skills');
    res.json(list);
  } catch (err) {
    console.error('Get applications', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, [param('id').isMongoId(), body('status').isIn(['accepted', 'rejected'])], validate, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate('opportunity_id');
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    if (String(app.opportunity_id.organization) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    app.status = req.body.status;
    await app.save();
    res.json(app);
  } catch (err) {
    console.error('Update application', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
