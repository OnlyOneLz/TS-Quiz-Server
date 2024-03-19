const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/user', userController.loginUser);
router.get('/users', userController.allUsers);
router.delete('/users', userController.deleteUser);

module.exports = router;