const express = require("express");
require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { GenerateFeedback } = require("../models/generate.feedback");
const { Feedback, validateFeedBack } = require("../models/feedback");
const { Teacher } = require("../models/teacher");
const auth = require("../middleware/auth");
const checkCookies = require("../middleware/cookie.checker");
const jwt = require("jsonwebtoken");

const router = express.Router();

// generate feedback
router.post("/generate", auth, async (req, res) => {
  const { user } = req;

  const teacher = await Teacher.findById(user._id);
  if (!teacher) return res.status(404).send(`user not found`);

  const generateFeedback = new GenerateFeedback({
    teacher: user._id,
    secreat: generateClassToekn(user._id),
  });
  await generateFeedback.save();

  res.send({ sid: generateFeedback.shortId, date: generateFeedback.date });
});

// give feedback
router.post("/", checkCookies, async (req, res) => {
  const { error } = validateFeedBack(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // find id
  const getFeedbackDetails = await GenerateFeedback.findOne({
    shortId: req.body.shortId,
  });

  if (!getFeedbackDetails) return res.status(404).send(`not found`);

  let decoded;
  try {
    decoded = varifyClassToken(getFeedbackDetails.secreat);
  } catch (ex) {
    return res.status(500).send(`invalid token or the session is expired`);
  }

  const feedback = new Feedback({
    shortId: getFeedbackDetails.shortId,
    teacher: getFeedbackDetails.teacher,
    feedback: req.body.feedback,
  });

  await feedback.save();

  const setFeedback = {
    _id: feedback._id,
    status: `successful`,
  };

  res.cookie("feedback", setFeedback, {
    expires: new Date(new Date().getTime() + 30 * 60000),
    httpOnly: true,
  });

  res.send(setFeedback);
});

const generateClassToekn = (teacherId) => {
  return jwt.sign(
    { _id: teacherId, date: new Date() },
    process.env.SECREAT_KEY,
    { expiresIn: "30m" }
  );
};

const varifyClassToken = (secreat) => {
  return jwt.verify(secreat, process.env.SECREAT_KEY);
};

module.exports = router;
