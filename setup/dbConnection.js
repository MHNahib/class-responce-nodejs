const mongoose = require("mongoose");

// create connection
mongoose
  .connect("mongodb://localhost/classresponse")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));
