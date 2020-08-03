const Router = require('koa-router');
const InventoryService = require('../services/inventory.service');
const Validate = require('../validators/item');
const searchRawFood = require('../services/external_api.service').searchRawFood;

const router = new Router();

/**
 * GET /api/inventory
 * Get all items from the database.
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/', async (ctx) => {
    try {
        ctx.body = await InventoryService.getItems(ctx.state.user);
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * GET /api/inventory/search/:name
 * Get all items starting with the specified pattern from the database.
 * @requires { params } name
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/search/:name', async (ctx) => {
    try {
        const { errors, name } = await Validate.searchByName(ctx.params);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = await InventoryService.searchItemByName(ctx.state.user, name);
    } catch (error) {
        ctx.throw(500, error);
    }
});

router.get('/between', async (ctx) => {
    try {
        const { errors, startDate, endDate } = Validate.getAddedBetween(ctx.query);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = await InventoryService.getItemsAddedBetween(ctx.state.user, startDate, endDate);
    } catch (error) {
        ctx.throw(500, error);
    }
})

/**
 * GET /api/inventory/names?names=names
 * Get all items within the specified names list from the database.
 * @requires { query } names
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
router.get('/names', async (ctx) => {
    try {
        const { errors, refined } = await Validate.getByNames(ctx.query);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = InventoryService.getItemsByNames(ctx.state.user, refined);
    } catch (error) {
        ctx.throw(500, error);
    }
});

router.get('/nutrition', async (ctx) => {
    try {
        const { query } = ctx.request.query;

        ctx.body = await searchRawFood(query);
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * GET /api/inventory/:_id
 * Get all item from the database by _id.
 * @response { JSON, error? } Item objects if successful otherwise, an error.
 */
router.get('/:_id', async (ctx) => {
    try {
        const { _id } = ctx.params;

        ctx.body = await InventoryService.getItemById(ctx.state.user, _id);
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * POST /api/inventory
 * Creates a new item.
 * @requires { body } name, quantity, cost, addedDate, expirationDate, group
 * @response { JSON, error? } new item if successful otherwise, an error.
 */
router.post('/', async (ctx) => {
    try {
        const { errors, name, quantity, cost, addedDate, expirationDate, group } = await Validate.create(ctx.request.body, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = await InventoryService.createItem(ctx.state.user, name, quantity, cost, addedDate, expirationDate, group);
    } catch (error) {
        ctx.throw(400, error);
    }
});

/**
 * PUT /api/inventory/:option
 * Updates an existing item. If the updated item's quantity is less than or 
 * equal to 0, delete the item.
 * @requires { body, params } _id, name, quantity, cost, addedDate, expirationDate, group, option
 * @response { JSON, error? } updated item if successful otherwise, an error.
 */
router.put('/:option', async (ctx) => {
    try {
        const { errors, _id, name, quantity, cost, addedDate, expirationDate, group, option } = await Validate.update(ctx.request.body, ctx.params, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = await InventoryService.updateItem(ctx.state.user, _id, name, quantity, cost, addedDate, expirationDate, group, option);

    } catch (error) {
        ctx.throw(400, error);
    }
});

/**
 * DEL /api/inventory/:id
 * Deletes an item by _id using the deleteItemById(string) function.
 * @requires { params } _id
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
router.del('/:_id', async (ctx) => {
    try {
        const { errors, _id } = Validate.del(ctx.params, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        ctx.body = { ok: await InventoryService.deleteItemById(_id, ctx.state.user) };
    } catch (error) {
        ctx.throw(400, error);
    }
});

module.exports = router.routes();
