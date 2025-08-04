const mongoose = require('mongoose');

const BreachEmailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  breachCount: { type: Number, default: 0 },
  lastChecked: { type: String },
  status: { type: String, default: 'checking' },
  breaches: [String],
  alertsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

const BreachEmail = mongoose.model('BreachEmail', BreachEmailSchema);
