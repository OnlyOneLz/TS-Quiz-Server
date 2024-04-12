const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.get('/displayAll', answerController.allAnswers);
router.post('/display', answerController.byQuestion);
router.post('/create', answerController.createQuestionWithAnswers);

module.exports = router;