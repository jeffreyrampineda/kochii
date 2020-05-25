const Item = require('../models/item');
const Group = require('../models/group');
const Validate = require('../validators/group');

/**
 * Gets all group from the database.
 * @response { string[], error? } array of strings if successful otherwise, an error.
 */
async function getAll(ctx) {
    try {
        const groups = await Group.find();

        ctx.body = groups.map(group => group.name);
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Creates a new group.
 * @requires { params } name
 * @response { string, error? } group's name if successful otherwise, an error.
 */
async function create(ctx) {
    try {
        const { name = "" } = ctx.params;
        const errors = Validate.create({ name });

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const group = await Group.create({ name });

        if (group) {
            global.io.sockets.emit('group_create', group.name);
            ctx.body = group.name;
        }
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes a group. Before deleting, sets all Items' group with the same group name
 * to 'Default'.
 * @requires { params } name
 * @response { string, error? } group's name if successful otherwise, an error.
 */
async function del(ctx) {
    try {
        const { name } = ctx.params;

        const item_result = await Item.updateMany({ group: name }, { $set: { group: 'Default' } });
        if (item_result.nModified >= 1) {
            const items = await Item.find({ group: 'Default' });

            global.io.sockets.emit('item_updateMany', items);
        }

        const result = await Group.deleteOne({ name });

        if (result.ok === 1) {
            global.io.sockets.emit('group_delete', name);
            ctx.body = name;
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
