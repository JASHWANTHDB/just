const express = require('express');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { createSchedule, getSchedules } = require('../controllers/scheduleController');

const router = express.Router();

// Create schedule (admin only)
router.post('/', authMiddleware, isAdmin, createSchedule);

// Get all schedules
router.get('/', authMiddleware, getSchedules);

module.exports = router;
