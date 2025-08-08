const ChatMessage = require('../models/ChatMessage');

// Reusable function to save a message (encrypted)
exports.saveMessage = async ({ sender, recipient, encryptedText, selfDestructSeconds, clientId }) => {
  console.log('saveMessage called with:', { sender, recipient, encryptedText, selfDestructSeconds, clientId });
  const selfDestructAt = selfDestructSeconds
    ? new Date(Date.now() + selfDestructSeconds * 1000)
    : undefined;
  // Save clientId as a virtual property (not in DB) for echoing back
  const message = new ChatMessage({ sender, recipient, encryptedText, selfDestructAt });
  if (clientId) message.clientId = clientId;
  console.log('Creating message object:', message);
  const savedMessage = await message.save();
  // Attach clientId to the returned object for socket echo
  if (clientId) savedMessage.clientId = clientId;
  console.log('Message saved to database:', savedMessage);
  return savedMessage;
};

// Send a message (encrypted) via REST
exports.sendMessage = async (req, res) => {
  const { sender, recipient, encryptedText, selfDestructSeconds } = req.body;
  // Log the incoming request for debugging
  console.log('POST /chat/send body:', req.body);
  // Allow emoji-only messages, but require encryptedText to be a non-empty string
  if (!sender || !recipient || typeof encryptedText !== 'string' || encryptedText.length === 0) {
    console.error('Validation failed:', { sender, recipient, encryptedText });
    return res.status(400).json({ success: false, message: 'Sender, recipient, and non-empty message are required.', debug: { sender, recipient, encryptedText } });
  }
  try {
    const saved = await exports.saveMessage({ sender, recipient, encryptedText, selfDestructSeconds });
    res.status(201).json({ success: true, message: 'Message sent.', saved });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
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