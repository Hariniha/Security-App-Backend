const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const chatFileController = require('../controllers/chatFileController');


router.post('/send', chatController.sendMessage);
router.get('/messages', chatController.getMessages);
router.post('/upload', chatFileController.uploadChatFile);

module.exports = router;