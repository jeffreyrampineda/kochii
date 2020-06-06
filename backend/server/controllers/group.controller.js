const Inventory = require('../models/inventory');
const createHistory = require('./history.controller').create;
const Validate = require('../validators/group');

/**
 * Get all groups from the database.
 * @response { string[], error? } array of strings if successful otherwise, an error.
 */
async function getAll(ctx) {
    try {
        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'groups');

        ctx.body = i.groups;
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Creates a new group.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
async function create(ctx) {
    try {
        const { name = "" } = ctx.params;
        const errors = await Validate.create({ name }, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const result = await Inventory.findOneAndUpdate(
            { owner: ctx.state.user._id },
            { $push: { groups: name } },
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok === 1) {
            await createHistory({ owner: ctx.state.user._id, method: 'created', target: 'group', addedDate: new Date(), quantity: 0, description: "Group created" });

            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('group_create', name);
            }
            ctx.body = { name };
        }
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes a group. Before deleting, sets all Items' group with the same group name
 * to 'Default'.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
async function del(ctx) {
    try {
        const { name } = ctx.params;

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
            await createHistory({ owner: ctx.state.user._id, method: 'removed', target: 'group', addedDate: new Date(), quantity: 0, description: "Permanently removed" });

            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('group_delete', name);
            }
            ctx.body = { name };
        }
    } catch (error) {
        ctx.throw(400, error);
    }
}

module.exports = {
    getAll,
    create,
    del
};
