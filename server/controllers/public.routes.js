const express = require('express');
const router = express.Router();

// Require controller modules.
const accountController = require('../controllers/account.controller');
const postController = require('./post.controller');
const websiteController = require('./website.controller');

/// WEBSITE ROUTES ///

router.get('/', websiteController.website_index);

router.get('/about-us', websiteController.website_about_us);

router.get('/legal/privacy-policy', websiteController.website_privacy_policy);

router.get(
  '/legal/terms-of-service',
  websiteController.website_terms_of_service,
);

router.get('/sent', websiteController.website_sent_get);

// POST /send request to send email
router.post('/send', websiteController.website_send_post);

/// RECIPES ROUTES ///

// GET request for one Post.
router.get('/recipes/:id', postController.post_detail);

// GET request for list of all Post.
router.get('/recipes', postController.post_list);

/// AUTH ROUTES ///

// POST /login request to login Account.
router.post('/login', accountController.account_login);

// POST /signup request to create Account.
router.post('/signup', accountController.account_create);

// GET /verification?token=token&email=email request to verify Account.
router.get('/verification', accountController.account_verify);

module.exports = router;
