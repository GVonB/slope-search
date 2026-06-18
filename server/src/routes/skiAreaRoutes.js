const express = require('express');
const router = express.Router();
const skiAreaController = require('../controllers/skiAreaController');
const skiAreaNameController = require('../controllers/skiAreaNameController');
const skiAreaWebsiteController = require('../controllers/skiAreaWebsiteController');
const cached = require('../utils/cache');

// All ski areas (cached: heavy aggregate over a static dataset)
router.get('/', cached(skiAreaController.getSkiAreas));

// Names for a ski area based on id
router.get('/:id/names', skiAreaNameController.getNamesBySkiAreaId);

// Websites for a ski area based on id
router.get('/:id/websites', skiAreaWebsiteController.getWebsitesBySkiAreaId);

// Filtered names with ids for dropdown menu to select from
router.get('/names', skiAreaNameController.getAllPrimaryNamesWithId);

module.exports = router;