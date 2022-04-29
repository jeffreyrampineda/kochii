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

/// RECIPES ROUTES ///

// GET request for creating a Post. NOTE This must come before route that displays Post (uses id).
router.get("/recipes/create", post_controller.post_create_get);

// POST request for creating Post.
router.post("/recipes/create", post_controller.post_create_post);

// GET request to delete Post.
router.get("/recipes/:id/delete", post_controller.post_delete_get);

// POST request to delete Post.
router.post("/recipes/:id/delete", post_controller.post_delete_post);

// GET request to update Post.
router.get("/recipes/:id/update", post_controller.post_update_get);

// POST request to update Post.
router.post("/recipes/:id/update", post_controller.post_update_post);

// GET request for one Post.
router.get("/recipes/:id", post_controller.post_detail);

// GET request for list of all Post.
router.get("/recipes", post_controller.post_list);

/// AUTH ROUTES ///

// POST /login request to login Account.
router.post("/login", account_controller.account_login);

// POST /register request to create Account.
router.post("/register", account_controller.account_create);

// GET /verification?token=token&email=email request to verify Account.
router.get("/verification", account_controller.account_verify);

module.exports = router;
