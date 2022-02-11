const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// teacher schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
    minlength: 3,
    maxlength: 55,
  },
  email: {
    type: String,
    requried: true,
    minlength: 3,
    maxlength: 55,
    unique: true,
  },
  password: {
    type: String,
    requried: true,
    minlength: 3,
  },

  isAdmin: {
    type: Boolean,
    default: true,
  },

  approved: {
    type: Boolean,
    default: true,
  },
});

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, approved: this.approved },
    process.env.JWT_TOKEN
  );
};

// model
const Admin = new mongoose.model("Admin", adminSchema);

const validateAdmin = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().min(3).max(55).required(),
    password: Joi.string().min(3).required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(body);
};

module.exports.validate = validateAdmin;
module.exports.Admin = Admin;
