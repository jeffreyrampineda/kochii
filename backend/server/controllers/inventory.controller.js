const Item = require('../models/item');
const HistoryController = require('./history.controller');
const Validate = require('../validators/item');

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
        const { name = "", quantity = 0, addedDate = "", expirationDate = "", group = "" } = ctx.request.body;
        const errors = Validate.create({ name, quantity, addedDate, expirationDate, group });

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

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
 * @requires { body, params } _id, name, quantity, addedDate, expirationDate, group, option
 * @response { JSON, error? } updated item if successful otherwise, an error.
 */
async function update(ctx) {
    try {
        const { _id = "", name = "", quantity = 0, addedDate = "", expirationDate = "", group = "" } = ctx.request.body;
        const { option = "" } = ctx.params;
        const errors = await Validate.update({ _id, name, quantity, addedDate, expirationDate, group, option });

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        let itemData = {
            $set: {
                name,
                expirationDate,
                group,
            },
            $inc: {}
        }

        // Setting or incrementing.
        itemData["$" + option].quantity = quantity;

        // Const item is the newly updated Item.
        const item = await Item.findOneAndUpdate(
            { _id },
            itemData,
            { new: true, useFindAndModify: false, runValidators: true }
        );

        // If new quantity is less than or equal to 0, delete Item.
        if (item.quantity <= 0) {
            deleteItemById(_id);
        } else {
            global.io.sockets.emit('item_update', item);
        }

        ctx.body = item;
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes an item by _id using the deleteItemById(string) function.
 * @requires { params } _id
 * @response { number, error? } delete's result otherwise, an error.
 */
async function del(ctx) {
    try {
        const { _id } = ctx.params;

        ctx.body = await deleteItemById(_id);
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes an item by _id. If successful, emits 'item_remove' to the
 * connected socket(s).
 * @param { string } _id 
 * @returns { number } delete's result.
 */
async function deleteItemById(_id) {
    const result = await Item.deleteOne({ _id });

    if (result.ok === 1) {
        global.io.sockets.emit('item_remove', _id);
    }
    return result.ok;
}

module.exports = {
    getAll,
    searchByName,
    getByNames,
    create,
    update,
    del
};
