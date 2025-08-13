const express = require('express');
const router = express.Router();
const Password = require('../models/Password');
const Log = require('../models/Log');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Dashboard summary route
router.get('/summary', verifyToken, async (req, res) => {
  try {
    // Safety score: simple calculation based on password strength, 2FA, breaches, etc.
    // For demo, use static or simple logic
    const safetyScore = 100;

    // Alerts: count logs with type 'alert' for this user
    const alerts = await Log.countDocuments({ userId: req.user.id, type: 'alert' });

    // Messages: count unread messages for this user
    const unreadMessages = await ChatMessage.countDocuments({ recipient: req.user.email });

    // Breaches: count logs with type 'breach' for this user
    const breaches = await Log.countDocuments({ userId: req.user.id, type: 'breach' });

    // Password strength (average, for demo just static)
    const passwordStrength = 92;
    // Vault encryption (static)
    const vaultEncryption = 100;
    // 2FA coverage (static)
    const twoFACoverage = 76;

    // Recent activity (last 4 logs)
    const recentActivity = await Log.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('type message createdAt');

    res.json({
      safetyScore,
      alerts,
      unreadMessages,
      breaches,
      passwordStrength,
      vaultEncryption,
      twoFACoverage,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

module.exports = router;
