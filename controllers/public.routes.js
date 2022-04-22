const express = require("express");
const router = express.Router();
const sendContactEmail =
  require("../services/external_api.service").sendContactEmail;

router.post("/send", async function (req, res) {
  try {
    const { from_email, from_name, body } = req.body;
    sendContactEmail(from_email, from_name, body);
    res.redirect("/sent");
  } catch (error) {
    res.status(400).json(error);
  }
});
router.use("/auth", require("./authentication.controller"));

module.exports = router;
