const express = require('express');
const router = express.Router();
const { getSettings, saveSettings } = require('../controllers/settingsController');

router.get('/:userId', getSettings);
router.post('/:userId', saveSettings);

module.exports = router;
