const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');

router.get('/', runController.getRuns);

module.exports = router;