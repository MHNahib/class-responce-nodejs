require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");

const jwt = require("jsonwebtoken");

// teacher schema
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
    minlength: 3,
    maxlength: 55,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  designation: {
    type: String,
    requried: true,
    minlength: 3,
    maxlength: 55,
  },
  isTeacher: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

teacherSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, isTeacher: this.isTeacher },
    process.env.JWT_TOKEN
  );
};

// model
const Teacher = new mongoose.model("Teacher", teacherSchema);

const validateTeacher = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(3).max(255).required(),
    designation: Joi.string().min(3).max(55).required(),
    isTeacher: Joi.boolean(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(body);
};

module.exports.validate = validateTeacher;
module.exports.Teacher = Teacher;
