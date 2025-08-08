const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const crypto = require('crypto');
const ChatMessage = require('../models/ChatMessage');

// Multer setup for chat uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }).single('file');



exports.uploadChatFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload failed' });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const { sender, recipient } = req.body;
    if (!sender || !recipient) return res.status(400).json({ error: 'Sender and recipient required' });
    // Save as a chat message with file info (no encryption)
    const chatMsg = new ChatMessage({
      sender,
      recipient,
      encryptedText: '[File]',
      file: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
    await chatMsg.save();
    res.status(201).json({
      message: 'File uploaded and sent in chat',
      chatMsg
    });
  });
};
