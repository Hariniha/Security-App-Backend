const express = require('express');
const router = express.Router();
const Password = require('../models/Password');
const verifyToken = require('../middleware/authMiddleware');

// Get all passwords (for logged-in user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id });
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch passwords" });
  }
});

// Add a new password
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPassword = new Password({
      ...req.body,
      userId: req.user.id,
    });

    const saved = await newPassword.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to save password" });
  }
});

// Update a password
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Password not found or unauthorized" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Delete a password
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Password not found or unauthorized" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete password" });
  }
});

module.exports = router;
