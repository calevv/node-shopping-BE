const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

const app = express();
const MONGODB_URI_SHOP = process.env.MONGODB_URI_SHOP;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", indexRouter);

mongoose
  .connect(MONGODB_URI_SHOP, { useNewUrlParser: true })
  .then(() => {
    console.log("mongoose connectes");
  })
  .catch((err) => {
    console.log("DB connecton fail", err);
  });
app.listen(process.env.PORT || 5000, () => {
  console.log("server on ");
});
