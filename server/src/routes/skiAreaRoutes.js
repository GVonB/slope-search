const express = require('express');
const router = express.Router();
const skiAreaController = require('../controllers/skiAreaController');

router.get('/', skiAreaController.getSkiAreas);

module.exports = router;