const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const settingsRoutes = require('./routes/settingsRoutes');
const logRoutes = require('./routes/logRoutes');
const passwordRoutes = require('./routes/passwords');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/files');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);

module.exports = app;
