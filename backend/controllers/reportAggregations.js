const getRevenueReport = async (req, res) => {
  try {
    const { Payment } = require('../models/Payment'); // Lazy load if needed or ensure it's required at top
    const payments = await Payment.find({});

    // Aggregate by payment method for a pie chart
    const revenueByMethod = payments.reduce((acc, curr) => {
      acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + curr.amount;
      return acc;
    }, {});
    
    // Group by Date (Simple Last 7 Days logic for demo)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const revenueByDate = last7Days.map(date => {
      const dailyTotal = payments
        .filter(p => new Date(p.createdAt).toISOString().split('T')[0] === date)
        .reduce((sum, p) => sum + p.amount, 0);
      return { date, amount: dailyTotal };
    });

    res.json({
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      revenueByMethod: Object.keys(revenueByMethod).map(k => ({ name: k, value: revenueByMethod[k] })),
      revenueByDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOccupancyReport = async (req, res) => {
  try {
    const { Room } = require('../models/Room');
    const rooms = await Room.find({});
    
    const statusCounts = rooms.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(statusCounts).map(k => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      value: statusCounts[k]
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
