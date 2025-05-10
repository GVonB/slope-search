const express = require('express');
const router = express.Router();
const regionsController = require('../controllers/regionsController');

router.get('/', regionsController.getRegionsByCountry);

module.exports = router;