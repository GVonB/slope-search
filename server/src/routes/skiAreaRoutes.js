const express = require('express');
const router = express.Router();
const skiAreaController = require('../controllers/skiAreaController');
const skiAreaNameController = require('../controllers/skiAreaNameController');

// All ski areas
router.get('/', skiAreaController.getSkiAreas);

// Names for a ski area based on id
router.get('/:id/names', skiAreaNameController.getNamesBySkiAreaId);

module.exports = router;