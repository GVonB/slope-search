const express = require('express');
const router = express.Router();
const skiAreaNameController = require('../controllers/skiAreaNameController');

router.get('/:id/names', skiAreaNameController.getNamesBySkiAreaId);

module.exports = router;