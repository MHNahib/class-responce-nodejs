const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const shortid = require("shortid");

// feedback schema
const generateFeedbackSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  shortId: {
    type: String,
    default: shortid.generate,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  secreat: {
    type: String,
    required: true,
  },
});

const GenerateFeedback = new mongoose.model(
  "GenerateFeedback",
  generateFeedbackSchema
);

module.exports.GenerateFeedback = GenerateFeedback;
