const express = require("express");
const router = express.Router();

// Require controller modules.
const inventory_controller = require("../controllers/inventory.controller");
const group_controller = require("../controllers/group.controller");
const post_controller = require("../controllers/post.controller");
const activity_controller = require("../controllers/activity.controller");
const account_controller = require("../controllers/account.controller");

/// INVENTORY ROUTES ///

// GET /api/inventory
router.get("/inventory", inventory_controller.item_list);

// GET /api/inventory/search/:name
router.get("/inventory/search/:name", inventory_controller.item_list_search);

// GET /api/inventory/between
router.get("/inventory/between", inventory_controller.item_list_between_dates);

// GET /api/inventory/names?names=names
router.get("/inventory/names", inventory_controller.item_list_names);

// GET /api/inventory/nutrition
router.get("/inventory/nutrition", inventory_controller.item_nutrition);

// GET /api/inventory/:_id
router.get("/inventory/:_id", inventory_controller.item_detail);

// POST /api/inventory
router.post("/inventory", inventory_controller.item_create);

// PUT /api/inventory/:option
router.put("/inventory/:option", inventory_controller.item_update);

// DELETE /api/inventory/:id
router.delete("/inventory/:_id", inventory_controller.item_delete);

/// GROUPS ROUTES ///

// GET /api/groups
router.get("/groups", group_controller.group_list);

// POST /api/groups/:name
router.post("/groups/:name", group_controller.group_create);

// DELETE /api/groups/:name
router.delete("/groups/:name", group_controller.group_delete);

/// RECIPES ROUTES ///

// POST request for creating Post.
router.post("/recipes", post_controller.post_create);

// DELETE request to delete Post.
router.delete("/recipes/:id", post_controller.post_delete);

// PUT request to update Post.
router.put("/recipes/:id", post_controller.post_update);

// GET /api/recipes/:id
router.get("/recipes/:id", post_controller.post_detail);

/// COLLECTIONS ROUTES ///

// GET /api/collection
router.get("/collection", post_controller.postcollection_get);

// POST /api/collection
router.post("/collection/:id", post_controller.postcollection_create);

// DELETE /api/collection
router.delete("/collection/:id", post_controller.postcollection_delete);

/// ACTIVITIES ROUTES ///

// GET /api/activities
router.get("/activities", activity_controller.activity_list);

// GET /api/activities/:days
router.get("/activities/:days", activity_controller.activity_list_period);

// DELETE /api/activities
router.delete("/activities", activity_controller.activity_delete);

/// ACCOUNT ROUTES ///

// PUT /api/account request to update Account.
router.put("/account", account_controller.account_update);

// DELETE /api/account request to delete Account.
router.delete("/account", account_controller.account_delete);

module.exports = router;
