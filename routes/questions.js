const express = require("express");
const { Question, validate } = require("../models/question");
const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const router = express.Router();

// get questions
router.get("/", async (req, res) => {
  // get all the questions
  const questions = await Question.find()
    .sort("question")
    .select({ question: 1, options: 1 });

  res.send(questions);
});

// set questions
router.post("/", auth, admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const question = new Question({
    question: req.body.question,
    options: req.body.options,
    admin: req.user._id,
  });

  await question.save();
  res.send(question);
});

module.exports = router;
