const express = require('express');
const router = express.Router();
const { getReviews, createReview, updateReviewStatus } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin', 'receptionist'), getReviews)
  .post(createReview); // Publicly accessible to add reviews

router.route('/:id/status')
  .put(protect, authorize('admin', 'receptionist'), updateReviewStatus);

module.exports = router;
