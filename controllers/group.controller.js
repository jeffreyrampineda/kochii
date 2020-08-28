const Router = require('koa-router');
const Inventory = require('../models/inventory');
const createActivity = require('../services/activity.service').create;
const Validate = require('../validators/group');

const router = new Router();

/**
 * GET /api/groups
 * Get all groups from the database.
 * @response { string[], error? } array of strings if successful otherwise, an error.
 */
router.get('/', async (ctx) => {
    try {
        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'groups');

        ctx.body = i.groups;
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * POST /api/groups/:name
 * Creates a new group.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
router.post('/:name', async (ctx) => {
    try {
        const { errors, name } = await Validate.create(ctx.params, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const result = await Inventory.findOneAndUpdate(
            { owner: ctx.state.user._id },
            { $push: { groups: name } },
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok === 1) {
            await createActivity({ owner: ctx.state.user._id, method: 'created', target: 'group', addedDate: new Date(), quantity: 0, description: "Group created" });

            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('group_create', name);
            }
            ctx.body = { name };
        }
    } catch (error) {
        ctx.throw(400, error);
    }
});

/**
 * DEL /api/groups/:name
 * Deletes a group. Before deleting, sets all Items' group with the same group name
 * to 'Default'.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
router.del('/:name', async (ctx) => {
    try {
        const { errors, name } = await Validate.del(ctx.params, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const item_result = await Inventory.findOneAndUpdate(
            {
                owner: ctx.state.user._id,
            },
            {
                $set: {
                    "items.$[i].group": 'Default'
                }
            },
            {
                arrayFilters: [{ "i.group": name }],
                new: true, runValidators: true, rawResult: true
            }
        );

        if (item_result.ok === 1) {
            const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'items');
            const result = i.items.filter(item => item.group === 'Default');
            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('item_updateMany', result);
            }
        }

        const result = await Inventory.findOneAndUpdate(
            { owner: ctx.state.user._id },
            { $pull: { groups: name } },
            { new: true, rawResult: true }
        );

        if (result.ok === 1) {
            await createActivity({ owner: ctx.state.user._id, method: 'removed', target: 'group', addedDate: new Date(), quantity: 0, description: "Permanently removed" });

            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('group_delete', name);
            }
            ctx.body = { name };
        }
    } catch (error) {
        ctx.throw(400, error);
    }
});

module.exports = router.routes();
