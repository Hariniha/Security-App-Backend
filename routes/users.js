const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Get all users (excluding the current user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(users.map(u => ({
      username: u.fullName || u.email,
      email: u.email,
      id: u._id
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
