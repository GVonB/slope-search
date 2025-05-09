const express = require('express');
const router = express.Router();
const skiAreaController = require('../controllers/skiAreaController');
const skiAreaNameController = require('../controllers/skiAreaNameController');
const skiAreaWebsiteController = require('../controllers/skiAreaWebsiteController');

// All ski areas
router.get('/', skiAreaController.getSkiAreas);

// Names for a ski area based on id
router.get('/:id/names', skiAreaNameController.getNamesBySkiAreaId);

// Websites for a ski area based on id
router.get('/:id/websites', skiAreaWebsiteController.getWebsitesBySkiAreaId);

module.exports = router;