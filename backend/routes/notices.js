const express = require('express');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const Notice = require('../models/Notice');

const router = express.Router();

// Create notice (admin only)
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, body, visibleTo } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body required' });
    }

    const notice = new Notice({
      title,
      body,
      visibleTo: visibleTo || 'all'
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notices
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notices = await Notice.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notice.countDocuments();

    res.json({
      notices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
