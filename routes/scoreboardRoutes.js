const express = require('express');
const router = express.Router();
const scoreboardController = require('../controllers/scoreboardController');

router.get('/all', scoreboardController.scoreboard);
router.post('/user', scoreboardController.addUserScore)

module.exports = router;