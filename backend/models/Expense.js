const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Salaries and Wages',
      'Utilities',
      'Maintenance and Repairs',
      'Supplies',
      'Marketing and Advertising',
      'Miscellaneous'
    ],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  amount: {
    type: Number,
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Scheduled'],
    default: 'Completed',
  },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
