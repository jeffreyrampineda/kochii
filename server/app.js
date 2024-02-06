const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const path = require("path");
const passport_middleware = require("./middlewares/passport.middleware");
const error_middleware = require("./middlewares/error.middleware");
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
app.use(passport_middleware.initialize());

// Routes
const routerPublic = require("./controllers/public.routes");
const routerProtected = require("./controllers/protected.routes");

// API Routes
app.use(
  "/api",
  passport_middleware.authenticate("jwt", { session: false }),
  routerProtected
);

// Redirect website routes to public routes.
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/", routerPublic);

// Redirect dashboard routes to ../client/dist.
app.use("/dashboard", express.static(path.join(__dirname, "dist/browser")));
app.use(["/login", "/register", "/dashboard"], function (req, res) {
  res.sendFile(path.join(__dirname, "dist/browser", "index.html"));
});

// Catch 404 error.
app.use(error_middleware.not_found_handler);

// Error handler
app.use(error_middleware.error_handler);

module.exports = app;
