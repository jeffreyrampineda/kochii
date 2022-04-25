const express = require("express");
const router = express.Router();
const sendContactEmail =
  require("../util/external_api.service").sendContactEmail;

// Require controller modules.
const account_controller = require("../controllers/account.controller");

router.get("/", function (req, res) {
  res.render("index", { title: "Personal Inventory | Kochii" });
});

router.get("/about-us", function (req, res) {
  res.render("about-us", { title: "About Us | Kochii" });
});

router.get("/legal/privacy-policy", function (req, res) {
  res.render("privacy-policy", { title: "Privacy | Kochii" });
});

router.get("/legal/terms-of-service", function (req, res) {
  res.render("terms-of-service", { title: "Legal Information | Kochii" });
});

router.get("/sent", function (req, res) {
  res.render("message", {
    title: "Message Sent | Kochii",
    message_title: "Success",
    message_description: "Your message was sent successfully",
  });
});

// POST /send request to send email
router.post("/send", async function (req, res) {
  try {
    const { from_email, from_name, body } = req.body;
    sendContactEmail(from_email, from_name, body);
    res.redirect("/sent");
  } catch (error) {
    res.status(400).json(error);
  }
});

/// AUTH ROUTES ///

// POST /login request to login Account.
router.post("/login", account_controller.account_login);

// POST /register request to create Account.
router.post("/register", account_controller.account_create);

// GET /verification?token=token&email=email request to verify Account.
router.get("/verification", account_controller.account_verify);

module.exports = router;
