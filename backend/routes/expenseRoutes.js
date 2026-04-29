const express = require('express');
const router = express.Router();
const { 
  getExpenses, 
  createExpense, 
  updateExpenseStatus,
  getExpenseStats 
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getExpenses)
  .post(protect, authorize('admin'), createExpense);

router.route('/stats')
  .get(protect, authorize('admin'), getExpenseStats);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateExpenseStatus);

module.exports = router;
