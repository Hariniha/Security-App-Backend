const express = require('express');
const cors = require('cors');
const settingsRoutes = require('./routes/settingsRoutes');
const logRoutes = require('./routes/logRoutes');
const passwordRoutes = require('./routes/passwords');
const authRoutes = require('./routes/auth');
const breachMonitorRoutes = require('./routes/breachMonitor');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/breach-monitor', breachMonitorRoutes);

module.exports = app;
