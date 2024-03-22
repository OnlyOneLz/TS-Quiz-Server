const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/user', userController.loginUser);
router.get('/users', userController.allUsers);
router.get('/info/:userId', userController.userInfo);
router.get('/leaderboard', userController.getLeaderboard);
router.delete('/users', userController.deleteUser);
router.put('/:userId/:points', userController.addProgress)

module.exports = router;