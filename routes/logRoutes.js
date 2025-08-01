const express = require('express');
const router = express.Router();
const { getLogs, addLog } = require('../controllers/logController');

router.get('/:userId', getLogs);


module.exports = router;
