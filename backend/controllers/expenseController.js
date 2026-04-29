const Expense = require('../models/Expense');
const Payment = require('../models/Payment');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).sort({ expenseDate: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { name, category, quantity, amount, expenseDate, status } = req.body;
    const expense = new Expense({
      name,
      category,
      quantity: quantity || 1,
      amount,
      expenseDate: expenseDate || Date.now(),
      status: status || 'Completed'
    });
    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpenseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      expense.status = status;
      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    const payments = await Payment.find({});

    const totalIncome = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Categorized expenses for doughnut chart
    const breakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const breakdownArray = Object.keys(breakdown).map(category => ({
      name: category,
      value: breakdown[category],
      percentage: ((breakdown[category] / totalExpenses) * 100).toFixed(2)
    }));

    res.json({
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      breakdown: breakdownArray
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpenseStatus,
  getExpenseStats
};
