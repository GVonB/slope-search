const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

router.get('/:userId', favoritesController.getFavoritesByUserId);
router.post('/add', favoritesController.addFavorite);
router.delete('/remove', favoritesController.removeFavorite);

module.exports = router;