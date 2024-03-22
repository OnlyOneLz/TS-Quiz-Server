const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.get('/displayAll', answerController.allAnswers);
router.get('/display/:question', answerController.byQuestion);

module.exports = router;