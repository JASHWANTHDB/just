const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const {
  createRequest,
  getRequests,
  getMyRequests,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

const router = express.Router();

// Create request (owner only)
router.post(
  '/',
  authMiddleware,
  [
    body('type').notEmpty().withMessage('Type is required'),
    body('details').notEmpty().withMessage('Details are required')
  ],
  createRequest
);

// Get my requests (owner) - MUST be before /:id
router.get('/my', authMiddleware, getMyRequests);

// Get all requests (admin only)
router.get('/', authMiddleware, isAdmin, getRequests);

// Update request (admin only)
router.put('/:id', authMiddleware, isAdmin, updateRequest);

// Delete request (admin or owner)
router.delete('/:id', authMiddleware, deleteRequest);

module.exports = router;
