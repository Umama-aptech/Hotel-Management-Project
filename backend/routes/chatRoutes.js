const express = require('express');
const router = express.Router();
const { processChat, getChatHistory } = require('../controllers/chatController');

router.post('/', processChat);
router.get('/history', getChatHistory);

module.exports = router;
