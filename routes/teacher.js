const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const router = express.Router();
const { Teacher, validate } = require("../models/teacher");

router.post("/signup", async (req, res) => {
  // vaidate requset
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user already exist
  const checkEmail = await Teacher.findOne({ email: req.body.emai });
  if (checkEmail) return res.status(400).send("email already exists");

  // encrypt and decrypt pass
  const solt = await bcrypt.genSalt(10);
  const passwaord = await bcrypt.hash(req.body.password, solt);

  // register user
  let user;
  try {
    user = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: passwaord,
      designation: req.body.designation,
      isTeacher: true,
      isAdmin: false,
    });

    user = await user.save();
  } catch (ex) {
    console.log(ex);
    res.status(500).send(`something went wrong`);
  }
  const token = user.generateAuthToken();
  // console.log(token);
  // res.cookie("teacher", {
  //   id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   token: token,
  // });

  res.header("x-auth-token", token).send({
    name: user.name,
    email: user.email,
    designation: user.designation,
  });
});

router.post("/login", async (req, res) => {
  // check validator
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  user = await Teacher.findOne({ emai: req.body.emai });

  if (!user) res.status(401).send("email or password is wrong");

  let isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid) res.status(401).send("email or password is wrong");

  const token = user.generateAuthToken();
  // console.log(token);
  // res.cookie("teacher", {
  //   id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   token: token,
  // });

  res.header("x-auth-token", token).send({
    name: user.name,
    email: user.email,
    designation: user.designation,
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
