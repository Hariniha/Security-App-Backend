const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  encryptedText: { type: String, required: true }, // Only encrypted text!
  timestamp: { type: Date, default: Date.now },
  selfDestructAt: { type: Date }, // Optional: for self-destructing messages
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);