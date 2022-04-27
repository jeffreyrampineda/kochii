const express = require("express");
const router = express.Router();

// Require controller modules.
const account_controller = require("../controllers/account.controller");
const post_controller = require("./post.controller");
const website_controller = require("./website.controller");

/// WEBSITE ROUTES ///

router.get("/", website_controller.website_index);

router.get("/about-us", website_controller.website_about_us);

router.get("/legal/privacy-policy", website_controller.website_privacy_policy);

router.get(
  "/legal/terms-of-service",
  website_controller.website_terms_of_service
);

router.get("/sent", website_controller.website_sent_get);

// POST /send request to send email
router.post("/send", website_controller.website_send_post);

/// BLOG ROUTES ///

// GET request for creating a Post. NOTE This must come before route that displays Post (uses id).
router.get("/blog/create", post_controller.post_create_get);

// POST request for creating Post.
router.post("/blog/create", post_controller.post_create_post);

// GET request to delete Post.
router.get("/blog/:id/delete", post_controller.post_delete_get);

// POST request to delete Post.
router.post("/blog/:id/delete", post_controller.post_delete_post);

// GET request to update Post.
router.get("/blog/:id/update", post_controller.post_update_get);

// POST request to update Post.
router.post("/blog/:id/update", post_controller.post_update_post);

// GET request for one Post.
router.get("/blog/:id", post_controller.post_detail);

// GET request for list of all Post.
router.get("/blog", post_controller.post_list);

/// AUTH ROUTES ///

// POST /login request to login Account.
router.post("/login", account_controller.account_login);

// POST /register request to create Account.
router.post("/register", account_controller.account_create);

// GET /verification?token=token&email=email request to verify Account.
router.get("/verification", account_controller.account_verify);

module.exports = router;
