const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// question shcema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    minlength: 3,
  },
  options: {
    type: [String],
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
  },
});
const Question = new mongoose.model("Question", questionSchema);

const validateQuestoin = (body) => {
  const schema = Joi.object({
    question: Joi.string().min(3).required(),
    options: Joi.array().required(),
  });

  return schema.validate(body);
};

module.exports.Question = Question;
module.exports.validate = validateQuestoin;
