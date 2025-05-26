require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const photosRouter = require("./routes/photos");
const dashboardRouter = require("./routes/dashboard");
const badgesRoutes = require("./routes/badges");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/photos", photosRouter);
app.use("/dashboard", dashboardRouter);
app.use("/badges", badgesRoutes);

module.exports = app;
