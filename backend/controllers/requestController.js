const ServiceRequest = require('../models/ServiceRequest');
const { validationResult } = require('express-validator');

// Create service request
const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, details, images } = req.body;
    const ownerId = req.user.userId;

    const request = new ServiceRequest({
      ownerId,
      type,
      details,
      images: images || []
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all requests (paginated)
const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await ServiceRequest.find()
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'name email phone apartmentNumber address')
      .populate('assignedTo', 'name')
      .lean(); // Use lean for better performance

    // Map to include ownerName for frontend
    const requestsWithOwnerName = requests.map(req => ({
      ...req,
      ownerName: req.ownerId?.name || 'Unknown Owner'
    }));

    const total = await ServiceRequest.countDocuments();

    res.json({
      requests: requestsWithOwnerName,
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

// Get user's requests
const getMyRequests = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await ServiceRequest.find({ ownerId })
      .skip(skip)
      .limit(limit);

    const total = await ServiceRequest.countDocuments({ ownerId });

    res.json({
      requests,
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

// Update request status
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    console.log('Update request:', { id, status, assignedTo, userId: req.user?.userId, role: req.user?.role });

    const request = await ServiceRequest.findByIdAndUpdate(
      id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    ).populate('ownerId', 'name email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getMyRequests,
  updateRequest,
  deleteRequest
};
