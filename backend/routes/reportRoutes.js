const express = require('express');
const router = express.Router();
const { getDashboardStats, getRevenueReport, getOccupancyReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('admin', 'receptionist'), getDashboardStats);
router.get('/revenue', protect, authorize('admin'), getRevenueReport);
router.get('/occupancy', protect, authorize('admin', 'receptionist'), getOccupancyReport);

module.exports = router;
