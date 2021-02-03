const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/index");
const employeeRouter = require("./routes/employees");
const adminRouter = require("./routes/admins");
const roomRouter = require("./routes/rooms");

const app = express();

mongoose.connect("mongodb://localhost:27017/bluestack", {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.on("error", err => {
  console.log(chalk.red(err));
});
fs.readdirSync(__dirname + "/models").forEach(function (filename) {
  if (~filename.indexOf(".js")) require(__dirname + "/models/" + filename);
});

app.disable('etag');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));

app.use(
  bodyParser.json({
    limit: "250mb"
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "250mb",
    extended: true,
    parameterLimit: 250000
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/admins", adminRouter);
app.use("/employees", employeeRouter);
app.use("/rooms", roomRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.status(500).send({
    error: "Internal Server Error!"
  });
});

module.exports = app;
