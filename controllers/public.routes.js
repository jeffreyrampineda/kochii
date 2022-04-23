const express = require("express");
const router = express.Router();
const sendContactEmail =
  require("../services/external_api.service").sendContactEmail;

// Require controller modules.
const account_controller = require("../controllers/account.controller");

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

// POST /api/public/auth/login request to login Account.
router.post("/auth/login", account_controller.account_login);

// POST /api/public/auth/register request to create Account.
router.post("/auth/register", account_controller.account_create);

// GET /api/public/auth/verification?token=token&email=email request to verify Account.
router.get("/auth/verification", account_controller.account_verify);

module.exports = router;
