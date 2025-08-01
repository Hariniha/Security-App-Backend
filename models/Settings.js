const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  twoFactorAuth: Boolean,
  emailAlerts: Boolean,
  autoLogout: Number,
  darkTheme: Boolean,
  biometricAuth: Boolean,
  sessionTimeout: Number,
  breachAlerts: Boolean,
  chatNotifications: Boolean,
  vaultNotifications: Boolean
});

module.exports = mongoose.model('Settings', SettingsSchema);
