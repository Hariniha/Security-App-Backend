const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const found = await User.findOne({ email });
  if (!found) return res.status(401).json({ error: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, found.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ userId: found._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
