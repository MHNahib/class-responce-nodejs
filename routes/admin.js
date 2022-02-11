const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { Admin, validate } = require("../models/admin");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(401).send("email or password is wrong");

  const isValid = await bcrypt.compare(req.body.password, admin.password);

  if (!isValid) res.status(401).send("email or password is wrong");

  const token = admin.generateAuthToken();

  res.header("x-auth-token", token).send({
    name: admin.name,
    email: admin.email,
    status: `successful`,
  });
});

// signup
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const isvalid = await Admin.findOne({ email: req.body.email });

  if (isvalid) return res.status(400).send("email already exists");

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: password,
    isAdmin: true,
    approved: true,
  });

  await admin.save();
  const token = admin.generateAuthToken();

  res.header("x-auth-token", token).send({
    name: admin.name,
    email: admin.email,
    status: `successful`,
  });
});

const validateLogin = (body) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(body);
};

module.exports = router;
