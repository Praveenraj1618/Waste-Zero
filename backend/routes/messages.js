// routes/messages.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

const Message = require('../models/Message');

// send message (REST fallback)
router.post('/', auth, [body('receiver_id').isMongoId(), body('content').notEmpty()], validate, async (req, res) => {
  try {
    const msg = await Message.create({
      sender_id: req.user.id,
      receiver_id: req.body.receiver_id,
      content: req.body.content,
      delivered: false,
      read: false
    });
    res.status(201).json(msg);
  } catch (err) {
    console.error('Send message', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get list of conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Aggregate to find unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender_id: userId }, { receiver_id: userId }]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender_id', userId] },
              '$receiver_id',
              '$sender_id'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);

    // Populate user details
    const User = require('../models/User');
    const populated = await User.populate(conversations, { path: '_id', select: 'name email' });

    const result = populated.map(c => ({
      partner: c._id,
      lastMessage: c.lastMessage
    }));

    res.json(result);
  } catch (err) {
    console.error('Get conversations', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get conversation
router.get('/:conversationPartnerId', auth, [param('conversationPartnerId').isMongoId()], validate, async (req, res) => {
  try {
    const other = req.params.conversationPartnerId;
    const conv = await Message.find({
      $or: [
        { sender_id: req.user.id, receiver_id: other },
        { sender_id: other, receiver_id: req.user.id }
      ]
    }).sort('timestamp');
    res.json(conv);
  } catch (err) {
    console.error('Get conversation', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// mark message read (REST fallback)
router.put('/:id/read', auth, [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: 'Message not found' });

    if (String(msg.receiver_id) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    msg.read = true;
    await msg.save();
    res.json(msg);
  } catch (err) {
    console.error('Mark message read', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
