const ChatMessage = require('../models/ChatMessage');

// Reusable function to save a message (encrypted)
exports.saveMessage = async ({ sender, recipient, encryptedText, selfDestructSeconds }) => {
  console.log('saveMessage called with:', { sender, recipient, encryptedText, selfDestructSeconds });
  
  const selfDestructAt = selfDestructSeconds
    ? new Date(Date.now() + selfDestructSeconds * 1000)
    : undefined;
  
  const message = new ChatMessage({ sender, recipient, encryptedText, selfDestructAt });
  console.log('Creating message object:', message);
  
  const savedMessage = await message.save();
  console.log('Message saved to database:', savedMessage);
  
  return savedMessage;
};

// Send a message (encrypted) via REST
exports.sendMessage = async (req, res) => {
  const { sender, recipient, encryptedText, selfDestructSeconds } = req.body;
  await exports.saveMessage({ sender, recipient, encryptedText, selfDestructSeconds });
  res.status(201).json({ success: true, message: 'Message sent.' });
};

// Get messages between two users
exports.getMessages = async (req, res) => {
    console.log('Received GET messages request');
    const { user1, user2 } = req.query;
    const start = Date.now();
    const messages = await ChatMessage.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });
    console.log('Query took', Date.now() - start, 'ms');
    res.json(messages);
  };