const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin', 'receptionist'), getPayments)
  .post(protect, authorize('admin', 'receptionist'), createPayment);

module.exports = router;
