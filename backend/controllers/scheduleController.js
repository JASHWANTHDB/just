const Schedule = require('../models/Schedule');

// Create schedule
const createSchedule = async (req, res) => {
  try {
    const { date, serviceType, staffId, owners, notes } = req.body;

    const schedule = new Schedule({
      date,
      serviceType,
      staffId,
      owners,
      notes
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all schedules
const getSchedules = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const schedules = await Schedule.find()
      .skip(skip)
      .limit(limit)
      .populate('staffId', 'name')
      .populate('owners', 'name email');

    const total = await Schedule.countDocuments();

    res.json({
      schedules,
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
};

module.exports = {
  createSchedule,
  getSchedules
};
