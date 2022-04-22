const express = require("express");
const router = express.Router();
const InventoryService = require('../services/inventory.service');
const Validate = require('../validators/item');
const searchRawFood = require('../services/external_api.service').searchRawFood;
const createError = require("http-errors");

/**
 * GET /api/inventory
 * Get all items from the database.
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/', async function (req, res, next) {
    try {
        const items = await InventoryService.getItems(req.user);
        res.status(200).json(items);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * GET /api/inventory/search/:name
 * Get all items starting with the specified pattern from the database.
 * @requires { params } name
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/search/:name', async function (req, res, next) {
    try {
        const { name } = await Validate.searchByName(req.params);

        const item = await InventoryService.searchItemByName(req.user, name);
        res.status(200).json(item);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

router.get('/between', async function (req, res, next) {
    try {
        const { startDate, endDate } = Validate.getAddedBetween(req.query);

        const items = await InventoryService.getItemsAddedBetween(req.user, startDate, endDate);
        res.status(200).json(items);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
})

/**
 * GET /api/inventory/names?names=names
 * Get all items within the specified names list from the database.
 * @requires { query } names
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/names', async function (req, res, next) {
    try {
        const { refined } = await Validate.getByNames(req.query);

        const items = InventoryService.getItemsByNames(req.user, refined);
        res.status(200).json(items);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

router.get('/nutrition', async function (req, res, next) {
    try {
        const { query } = req.query;

        const result = await searchRawFood(query);
        res.status(200).json(result);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * GET /api/inventory/:_id
 * Get all item from the database by _id.
 * @response { JSON, error? } Item objects if successful otherwise, an error.
 */
router.get('/:_id', async function (req, res, next) {
    try {
        const { _id } = req.params;

        const item = await InventoryService.getItemById(req.user, _id);
        res.status(200).json(item);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * POST /api/inventory
 * Creates a new item.
 * @requires { body } name, quantity, cost, addedDate, expirationDate, group
 * @response { JSON, error? } new item if successful otherwise, an error.
 */
router.post('/', async function (req, res, next) {
    try {
        const { name, quantity, cost, addedDate, expirationDate, group } = await Validate.create(req.body, req.user);

        const item = await InventoryService.createItem(req.user, name, quantity, cost, addedDate, expirationDate, group);
        res.status(200).json(item);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * PUT /api/inventory/:option
 * Updates an existing item. If the updated item's quantity is less than or 
 * equal to 0, delete the item.
 * @requires { body, params } _id, name, quantity, cost, addedDate, expirationDate, group, option
 * @response { JSON, error? } updated item if successful otherwise, an error.
 */
router.put('/:option', async function (req, res, next) {
    try {
        const { _id, name, quantity, cost, addedDate, expirationDate, group, option } = await Validate.update(req.body, req.params, req.user);

        const item = await InventoryService.updateItem(req.user, _id, name, quantity, cost, addedDate, expirationDate, group, option);
        res.status(200).json(item);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * DEL /api/inventory/:id
 * Deletes an item by _id using the deleteItemById(account_id, item_id) function.
 * @requires { params } _id
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
router.delete('/:_id', async function (req, res, next) {
    try {
        const { _id } = Validate.del(req.params, req.user);

        const result = { ok: await InventoryService.deleteItemById(req.user, _id) };
        res.status(200).json(result);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

module.exports = router
