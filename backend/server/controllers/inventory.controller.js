const Item = require('../models/item');
const HistoryController = require('./history.controller');

async function getAll(ctx) {
    ctx.body = await Item.find().sort({ expirationDate: -1 });
}

async function searchByName(ctx) {
    ctx.body = await Item.find({ name: { $regex: "^" + ctx.params.name } });
}

async function getByNames(ctx) {
    let names = ctx.query.names.split(',');
    ctx.body = await Item.find({ name: { $in: names } });
}

/**
 * Creates a new item.
 * @requires { body } name, quantity, addedDate, expirationDate, group
 * @response { JSON, error? } new item if successful otherwise, an error.
 */
async function create(ctx) {
    try {
        const { name, quantity, addedDate, expirationDate, group } = ctx.request.body;

        const item = await Item.create({ name, quantity, addedDate, expirationDate, group });

        if (item) {
            HistoryController.create({ date: Date.now(), method: 'Create', target: item.name, description: '' });
            global.io.sockets.emit('item_create', item);
            ctx.body = item;
        }
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Updates an existing item. If the updated item's quantity is less than or 
 * equal to 0, delete the item.
 * @requires { body } _id, name, quantity, addedDate, expirationDate, group
 * @response { JSON, error? } updated item if successful otherwise, an error.
 */
async function update(ctx) {
    try {
        const { _id, name, quantity, expirationDate, group } = ctx.request.body;
        const { option } = ctx.params;

        /*
    if (quantity === 0) {
        ctx.throw(400, 'Quantity cannot be 0');
    }
        */

        let itemData = {
            $set: {
                name,
                expirationDate,
                group,
            }
        }

        // Setting or incrementing.
        if (option === 'inc') {
            itemData.$inc = { quantity };
        } else if (option === 'set') {
            itemData.$set.quantity = quantity;
        } else {
            ctx.throw(400, 'Invalid option');
        }

        // Const item is the newly updated Item.
        const item = await Item.findOneAndUpdate(
            { _id },
            itemData,
            { new: true, useFindAndModify: false }
        );

        // If new quantity is less than or equal to 0, delete Item.
        if (item.quantity <= 0) {
            const del_result = await Item.deleteOne({ _id });

            if (del_result.ok === 1) {
                global.io.sockets.emit('item_remove', _id);
                HistoryController.create({ date: Date.now(), method: 'Remove', target: name, description: '' });
            }
        } else {
            global.io.sockets.emit('item_update', item);
        }

        ctx.body = item;
    } catch (error) {
        ctx.throw(400, error);
    }
}

module.exports = {
    getAll,
    searchByName,
    getByNames,
    create,
    update
};
