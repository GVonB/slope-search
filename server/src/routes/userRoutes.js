const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.findOrCreateUser);
router.delete('/:userId', userController.deleteUserById);
// dev use
router.get('/', userController.getAllUsers);

module.exports = router;