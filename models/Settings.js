const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  twoFactorAuth: { type: Boolean, default: true },
  emailAlerts: { type: Boolean, default: true },
  autoLogout: { type: Number, default: 30 },
  darkTheme: { type: Boolean, default: true },
  biometricAuth: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 15 },
  breachAlerts: { type: Boolean, default: true },
  chatNotifications: { type: Boolean, default: true },
  vaultNotifications: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
