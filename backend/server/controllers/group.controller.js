const Item = require('../models/item');
const Group = require('../models/group');

async function getAll(ctx) {
    const groups = await Group.find();

    ctx.body = groups.map(group => group.name);
}

/**
 * Creates a new group.
 * TODO: backend validation check - see if group already exists
 * @param ctx - Context
 */
async function create(ctx) {
    const name = ctx.params.name;

    let result = await Group.create({ name });

    if (result) {
        global.io.sockets.emit('group_create', name);
    }

    ctx.body = result;
}

async function del(ctx) {
    const name = ctx.params.name;

    if (name === '' || name === 'Default') {
        ctx.throw(400, 'Cannot remove group');
    }

    let item_result = await Item.updateMany({ group: name }, { $set: { group: 'Default' } });
    if (item_result.nModified >= 1) {
        let items = await Item.find({ group: 'Default' });

        global.io.sockets.emit('item_updateMany', items);
    }

    let result = await Group.deleteOne({ name });

    if (result.ok === 1) {
        global.io.sockets.emit('group_delete', name);
    }

    ctx.body = result;
}

module.exports = {
    getAll,
    create,
    del
};
