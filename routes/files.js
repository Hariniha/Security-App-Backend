// View (preview) file (for images)
router.get('/view/:fileId', fileController.viewFile);
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Upload file
router.post('/upload', fileController.uploadFile);

// Get user's files
router.get('/', fileController.getFiles);

// Download file
router.get('/download/:fileId', fileController.downloadFile);

// Delete file
router.delete('/:fileId', fileController.deleteFile);

// Get storage stats
router.get('/stats', fileController.getStorageStats);

module.exports = router; 