const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: String,
  timestamp: String,
  location: String,
  ip: String
});

module.exports = mongoose.model('Log', LogSchema);
