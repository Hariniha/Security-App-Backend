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
    // Run DB queries in parallel for performance
    const [
      alerts,
      unreadMessages,
      breaches,
      recentActivity
    ] = await Promise.all([
      Log.countDocuments({ userId: req.user.id, type: 'alert' }),
      ChatMessage.countDocuments({ recipient: req.user.email }),
      Log.countDocuments({ userId: req.user.id, type: 'breach' }),
      Log.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('type message createdAt')
        .lean()
    ]);

    // Static values (could be calculated if needed)
    const safetyScore = 100;
    const passwordStrength = 92;
    const vaultEncryption = 100;
    const twoFACoverage = 76;

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
