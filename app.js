const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const { passport } = require("./passport");
const helmet = require("helmet");
const path = require("path");
//var cookieParser = require("cookie-parser");

// Create Express Application.
const app = express();

// Security
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

// Authentication
app.use(passport.initialize());

// Routes
const routerPublic = require("./controllers/public.routes");
const routerProtected = require("./controllers/protected.routes");

// API Routes
app.use(
  "/api",
  passport.authenticate("jwt", { session: false }),
  routerProtected
);

// Redirect website routes to public routes.
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/", routerPublic);

// Redirect dashboard routes to client/dist.
app.use("/dashboard", express.static(path.join(__dirname, "client/dist")));
app.use(["/login", "/register", "/dashboard"], function (req, res) {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// catch 404 error.
app.use(function (req, res, next) {
  res.render("message", {
    title: "Page Not Found | Kochii",
    message_title: "( ._.)",
    message_subtitle: "404 Not Found",
    message_description: "Sorry but the requested page is not found!",
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //console.log(err);
  // render the error page
  res.status(err.status || 500);
  if (["login", "register", "api"].includes(req.originalUrl.split("/")[1])) {
    res.send(err);
  } else {
    res.render("error");
  }
});

module.exports = app;
