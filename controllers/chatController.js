const ChatMessage = require('../models/ChatMessage');

// Send a message (encrypted)
exports.sendMessage = async (req, res) => {
  const { sender, recipient, encryptedText, selfDestructSeconds } = req.body;
  const selfDestructAt = selfDestructSeconds
    ? new Date(Date.now() + selfDestructSeconds * 1000)
    : undefined;

  const message = new ChatMessage({ sender, recipient, encryptedText, selfDestructAt });
  await message.save();
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