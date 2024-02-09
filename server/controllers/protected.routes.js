const express = require('express');
const router = express.Router();

// Require controller modules.
const inventoryController = require('../controllers/inventory.controller');
const groupController = require('../controllers/group.controller');
const postController = require('../controllers/post.controller');
const activityController = require('../controllers/activity.controller');
const accountController = require('../controllers/account.controller');

/// INVENTORY ROUTES ///

// GET /api/inventory
router.get('/inventory', inventoryController.item_list);

// GET /api/inventory/search/:name
router.get('/inventory/search/:name', inventoryController.item_list_search);

// GET /api/inventory/between
router.get('/inventory/between', inventoryController.item_list_between_dates);

// GET /api/inventory/names?names=names
router.get('/inventory/names', inventoryController.item_list_names);

// GET /api/inventory/nutrition
router.get('/inventory/nutrition', inventoryController.item_nutrition);

// GET /api/inventory/:_id
router.get('/inventory/:_id', inventoryController.item_detail);

// POST /api/inventory
router.post('/inventory', inventoryController.item_create);

// PUT /api/inventory/:option
router.put('/inventory/:option', inventoryController.item_update);

// DELETE /api/inventory/:id
router.delete('/inventory/:_id', inventoryController.item_delete);

/// GROUPS ROUTES ///

// GET /api/groups
router.get('/groups', groupController.group_list);

// POST /api/groups/:name
router.post('/groups/:name', groupController.group_create);

// DELETE /api/groups/:name
router.delete('/groups/:name', groupController.group_delete);

/// RECIPES ROUTES ///

// GET request for list of all Post.
router.get('/recipes', postController.post_list);

// POST request for creating Post.
router.post('/recipes', postController.post_create);

// DELETE request to delete Post.
router.delete('/recipes/:id', postController.post_delete);

// PUT request to update Post.
router.put('/recipes/:id', postController.post_update);

// GET /api/recipes/:id
router.get('/recipes/:id', postController.post_detail);

/// COLLECTIONS ROUTES ///

// GET /api/collection
router.get('/collection', postController.postcollection_get);

// POST /api/collection
router.post('/collection/:id', postController.postcollection_create);

// DELETE /api/collection
router.delete('/collection/:id', postController.postcollection_delete);

/// ACTIVITIES ROUTES ///

// GET /api/activities
router.get('/activities', activityController.activity_list);

// GET /api/activities/:days
router.get('/activities/:days', activityController.activity_list_period);

// DELETE /api/activities
router.delete('/activities', activityController.activity_delete);

/// ACCOUNT ROUTES ///

// PUT /api/account request to update Account.
router.put('/account', accountController.account_update);

// DELETE /api/account request to delete Account.
router.delete('/account', accountController.account_delete);

module.exports = router;
