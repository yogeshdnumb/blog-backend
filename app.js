require("dotenv").config();
const mongoose = require("mongoose");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');

const authRouter = require("./routes/authRouter");
const apiRouter = require("./routes/apiRouter");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', "http://192.168.29.83:5173"],
  credentials: true,            //access-control-allow-credentials:true
  // optionSuccessStatus: 200
}))

/* app.use((req, res, next) => {
  console.log(req.headers);
  next()
})
 */
mongoose.set("strictQuery", false);
const mongoDbUrl = process.env.MONGODB_URL_PROD || process.env.MONGODB_URL_DEV;
mongoose.connect(mongoDbUrl).catch((err) => {
  console.log(err);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send('e')
})
app.use("/auth", authRouter);
app.use(authMiddleware.isAuthenticated)
app.use("/api", apiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
