const express = require('express');
const router = express.Router();
const {createPayment, getPayments} = require('../controllers/paymentController.js');

// GET /api/payments - Get all payments
router.get('/', getPayments);

// POST /api/payments - Create new payment
router.post('/', createPayment);

module.exports = router;
