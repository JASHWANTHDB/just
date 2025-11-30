const express = require('express');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const Invoice = require('../models/Invoice');

const router = express.Router();

// Create invoice (admin only)
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { ownerId, amount, dueDate } = req.body;

    const invoice = new Invoice({
      ownerId,
      amount,
      dueDate
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.role === 'owner') {
      query = { ownerId: req.user.userId };
    }

    const invoices = await Invoice.find(query)
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'name email');

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
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

// Pay invoice (fake payment flow)
router.post('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Fake payment processing
    const fakeTxId = `TXN_${Date.now()}`;
    invoice.paid = true;
    invoice.paymentTxId = fakeTxId;

    await invoice.save();
    res.json({
      message: 'Payment processed successfully',
      invoice,
      transactionId: fakeTxId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
