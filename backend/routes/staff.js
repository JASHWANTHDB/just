const express = require('express');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const Staff = require('../models/Staff');

const router = express.Router();

// Create staff (admin only)
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, role, phone } = req.body;

    if (!name || !role || !phone) {
      return res.status(400).json({ error: 'Name, role, and phone required' });
    }

    const staff = new Staff({ name, role, phone });
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all staff
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const staff = await Staff.find()
      .skip(skip)
      .limit(limit)
      .populate('assignedTasks');

    const total = await Staff.countDocuments();

    res.json({
      staff,
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
