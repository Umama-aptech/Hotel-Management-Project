const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoomStatus, updateRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin', 'receptionist'), createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'receptionist'), updateRoom)
  .patch(protect, authorize('admin', 'receptionist', 'housekeeping'), updateRoomStatus);

module.exports = router;
