require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnection = require("./setup/dbConnection");
const home = require("./routes/home");
const teacher = require("./routes/teacher");
const admin = require("./routes/admin");
const feedback = require("./routes/feedback");
const questions = require("./routes/questions");

const app = express();

if (!process.env.JWT_TOKEN || !process.env.SECREAT_KEY) {
  console.log(`JWT PROVET KEY IS NOT DEFINED`);
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());

app.use("/", home);
app.use("/auth/teacher", teacher);
app.use("/auth/admin", admin);
app.use("/feedback", feedback);
app.use("/questions", questions);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
