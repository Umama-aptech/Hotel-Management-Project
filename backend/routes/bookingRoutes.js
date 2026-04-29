const express = require('express');
const router = express.Router();
const { getBookings, getMyBookings, createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin', 'receptionist'), getBookings)
  .post(protect, createBooking);

router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/:id/status')
  .put(protect, authorize('admin', 'receptionist'), updateBookingStatus);

module.exports = router;
