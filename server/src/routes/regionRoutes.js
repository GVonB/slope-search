const express = require('express');
const router = express.Router();
const regionsController = require('../controllers/regionsController');
const cached = require('../utils/cache');

router.get('/', cached(regionsController.getRegionsByCountry));

module.exports = router;