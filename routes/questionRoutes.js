const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/displayAll", questionController.allQuestions);
router.get("/display/:category", questionController.byCategory);
router.get("/Random", questionController.randomQuestions);

module.exports = router;
