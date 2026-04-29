const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(lastWeek);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    // 1. New Bookings & Trend
    const bookingsThisWeek = await Booking.countDocuments({ createdAt: { $gte: lastWeek } });
    const bookingsLastWeek = await Booking.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: lastWeek } });
    
    let bookingTrend = "0.00%";
    if (bookingsLastWeek > 0) {
      bookingTrend = `${(((bookingsThisWeek - bookingsLastWeek) / bookingsLastWeek) * 100).toFixed(2)}%`;
      if (bookingsThisWeek >= bookingsLastWeek) bookingTrend = "+" + bookingTrend;
    } else if (bookingsThisWeek > 0) {
      bookingTrend = "+100.00%";
    }

    // 2. Check-In & Check-Out (Scheduled for today)
    const checkInToday = await Booking.countDocuments({ checkInDate: { $gte: today, $lt: new Date(today.getTime() + 86400000) } });
    const checkOutToday = await Booking.countDocuments({ checkOutDate: { $gte: today, $lt: new Date(today.getTime() + 86400000) } });

    // 2a. Real Trends for Check-In/Check-Out (Comparing last 7 days vs previous 7 days)
    const checkInLastWeek = await Booking.countDocuments({ checkInDate: { $gte: lastWeek, $lt: today } });
    const checkInPrevWeek = await Booking.countDocuments({ checkInDate: { $gte: twoWeeksAgo, $lt: lastWeek } });
    
    let checkInTrend = "0.00%";
    if (checkInPrevWeek > 0) {
      checkInTrend = `${(((checkInLastWeek - checkInPrevWeek) / checkInPrevWeek) * 100).toFixed(2)}%`;
      if (checkInLastWeek >= checkInPrevWeek) checkInTrend = "+" + checkInTrend;
    } else if (checkInLastWeek > 0) {
      checkInTrend = "+100.00%";
    }

    const checkOutLastWeek = await Booking.countDocuments({ checkOutDate: { $gte: lastWeek, $lt: today } });
    const checkOutPrevWeek = await Booking.countDocuments({ checkOutDate: { $gte: twoWeeksAgo, $lt: lastWeek } });

    let checkOutTrend = "0.00%";
    if (checkOutPrevWeek > 0) {
      checkOutTrend = `${(((checkOutLastWeek - checkOutPrevWeek) / checkOutPrevWeek) * 100).toFixed(2)}%`;
      if (checkOutLastWeek >= checkOutPrevWeek) checkOutTrend = "+" + checkOutTrend;
    } else if (checkOutLastWeek > 0) {
      checkOutTrend = "+100.00%";
    }

    // 3. Total Revenue & Trend
    const paymentsAll = await Payment.find({});
    const totalRevenueSum = paymentsAll.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
    const revenueThisWeek = paymentsAll
      .filter(p => new Date(p.createdAt) >= lastWeek)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const revenueLastWeek = paymentsAll
        .filter(p => new Date(p.createdAt) >= twoWeeksAgo && new Date(p.createdAt) < lastWeek)
        .reduce((acc, curr) => acc + curr.amount, 0);

    let revenueTrend = "0.00%";
    if (revenueLastWeek > 0) {
      revenueTrend = `${(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100).toFixed(2)}%`;
      if (revenueThisWeek >= revenueLastWeek) revenueTrend = "+" + revenueTrend;
    } else if (revenueThisWeek > 0) {
      revenueTrend = "+100.00%";
    }

    // 4. Availability & Occupancy Rate
    const rooms = await Room.find({});
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(0) : 0;

    const availability = {
      occupied: occupiedRooms,
      available: rooms.filter(r => r.status === 'available').length,
      reserved: await Booking.countDocuments({ bookingStatus: 'confirmed' }),
      notReady: rooms.filter(r => r.status === 'cleaning' || r.status === 'maintenance').length,
      occupancyRate: `${occupancyRate}%`
    };

    res.json({
      newBookings: bookingsThisWeek,
      checkIn: checkInToday,
      checkOut: checkOutToday,
      totalRevenue: `$${totalRevenueSum.toLocaleString()}`,
      trends: {
        bookings: bookingTrend,
        checkIn: checkInTrend,
        checkOut: checkOutTrend,
        revenue: revenueTrend
      },
      availability
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const payments = await Payment.find({});

    const revenueByMethod = payments.reduce((acc, curr) => {
      acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + curr.amount;
      return acc;
    }, {});
    
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

module.exports = { getDashboardStats, getRevenueReport, getOccupancyReport };
