const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// question shcema
const feedbackSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  feedback: {
    type: [String],
    required: true,
  },
});

const validateFeedBack = (body) => {
  const schema = Joi.object({
    shortId: Joi.string().min(3).max(15).required(),
    feedback: Joi.array().required(),
  });

  return schema.validate(body);
};

const Feedback = new mongoose.model("Feedback", feedbackSchema);

module.exports.Feedback = Feedback;
module.exports.validateFeedBack = validateFeedBack;
