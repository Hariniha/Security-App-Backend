const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middleware/authMiddleware');
const BreachEmail = require('../models/Breach');

// Get all monitored emails for the user
router.get('/', verifyToken, async (req, res) => {
  const emails = await BreachEmail.find({ userId: req.user.userId });
  res.json(emails);
});

// Add a new email to monitor
router.post('/', verifyToken, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const newEmail = new BreachEmail({
    userId: req.user.userId,
    email,
    breachCount: 0,
    lastChecked: new Date().toISOString().split('T')[0],
    status: 'checking',
    breaches: [],
    alertsEnabled: true
  });
  await newEmail.save();
  res.status(201).json(newEmail);
});

// Remove an email from monitoring
router.delete('/:id', verifyToken, async (req, res) => {
  await BreachEmail.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ success: true });
});

// Toggle alerts for an email
router.patch('/:id/alerts', verifyToken, async (req, res) => {
  const email = await BreachEmail.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!email) return res.status(404).json({ error: 'Not found' });
  email.alertsEnabled = !email.alertsEnabled;
  await email.save();
  res.json(email);
});

module.exports = router;