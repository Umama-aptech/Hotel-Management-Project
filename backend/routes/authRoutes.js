const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected admin route to create staff
router.post('/add-staff', protect, authorize('admin'), registerUser);

module.exports = router;
