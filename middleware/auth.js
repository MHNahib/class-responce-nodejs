const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send(`access denied`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex);
    return res.status(400).send(`invalid token`);
  }
};

module.exports = auth;
