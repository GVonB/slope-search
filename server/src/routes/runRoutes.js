const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const cached = require('../utils/cache');

router.get('/', cached(runController.getRuns));

module.exports = router;