const Inventory = require('../models/inventory');
const createHistory = require('./history.controller').create;
const Validate = require('../validators/item');

/**
 * Get all items from the database.
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
async function getAll(ctx) {
    try {
        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'items');

        ctx.body = i.items;
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Get all items starting with the specified pattern from the database.
 * @requires { params } name
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
async function searchByName(ctx) {
    try {
        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'items');
        const re = new RegExp("^" + ctx.params.name);
        const result = i.items.filter(item => re.test(item.name));

        ctx.body = result;
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Get all items within the specified names list from the database.
 * @requires { params } names
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
async function getByNames(ctx) {
    try {
        const names = ctx.query.names.split(',');
        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'items');

        const result = i.items.filter(item => names.includes(item.name));

        ctx.body = result;
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Creates a new item.
 * @requires { body } name, quantity, addedDate, expirationDate, group
 * @response { JSON, error? } new item if successful otherwise, an error.
 */
async function create(ctx) {
    try {
        const { name = "", quantity = 0, addedDate = "", expirationDate = "", group = "" } = ctx.request.body;
        const errors = await Validate.create({ name, quantity, addedDate, expirationDate, group }, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const result = await Inventory.findOneAndUpdate(
            { owner: ctx.state.user._id },
            {
                $push: {
                    items: {
                        name,
                        quantity,
                        addedDate,
                        expirationDate,
                        group
                    }
                }
            },
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok === 1) {
            const item = result.value.items[result.value.items.length - 1];

            await createHistory({ owner: ctx.state.user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: item.quantity, description: "Item created" });

            for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                global.currentConnections[ctx.state.user._id][socket_id].socket.emit('item_create', item);
            }
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
        const errors = await Validate.update({ _id, name, quantity, addedDate, expirationDate, group, option }, ctx.state.user);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        let itemData = {
            $set: {
                "items.$.name": name,
                "items.$.addedDate": addedDate,
                "items.$.expirationDate": expirationDate,
                "items.$.group": group
            },
            $inc: {}
        }

        // Setting or incrementing.
        itemData["$" + option]["items.$.quantity"] = quantity;

        const i = await Inventory.findOne({ owner: ctx.state.user._id }, 'items');
        const oldVItem = i.items.find(item => item.name === name);
        const result = await Inventory.findOneAndUpdate(
            {
                owner: ctx.state.user._id,
                "items._id": _id
            },
            itemData,
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok == 1) {
            const item = result.value.items.find(i => i._id == _id);

            if (oldVItem.addedDate === item.addedDate) {
                await createHistory({ owner: ctx.state.user._id, method: 'delete', target: 'item', addedDate: oldVItem.addedDate, quantity: -oldVItem.quantity, description: "Changed dates" });
                await createHistory({ owner: ctx.state.user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: item.quantity, description: "Changed dates" });
            }
            if (option === 'set') {
                const newQuantity = item.quantity - oldVItem.quantity;

                if (newQuantity < 0) {
                    await createHistory({ owner: ctx.state.user._id, method: 'delete', target: 'item', addedDate: item.addedDate, quantity: newQuantity, description: "Updated item" });

                } else if (newQuantity > 0) {
                    await createHistory({ owner: ctx.state.user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: newQuantity, description: "Updated item" });
                }

            }
            if (option === 'inc') {
                if (quantity <= 0) {
                    await createHistory({ owner: ctx.state.user._id, method: 'delete', target: 'item', addedDate: item.addedDate, quantity, description: "Decreased quantities" });
                } else {
                    await createHistory({ owner: ctx.state.user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity, description: "Increased quantities" });
                }
            }

            // If new quantity is less than or equal to 0, delete Item.
            if (item.quantity <= 0) {
                await deleteItemById(_id, ctx.state.user);
            } else {
                for (const socket_id in global.currentConnections[ctx.state.user._id]) {
                    global.currentConnections[ctx.state.user._id][socket_id].socket.emit('item_update', item);
                }
            }
            ctx.body = item;
        }
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes an item by _id using the deleteItemById(string) function.
 * @requires { params } _id
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
async function del(ctx) {
    try {
        const { _id } = ctx.params;

        ctx.body = { ok: await deleteItemById(_id, ctx.state.user) };
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Deletes an item by _id. If successful, emits 'item_delete' to the
 * connected socket(s).
 * @param { string } _id 
 * @returns { number } delete's result.
 */
async function deleteItemById(_id, user) {
    const result = await Inventory.findOneAndUpdate(
        { owner: user._id },
        { $pull: { items: { _id } } },
        { new: true, rawResult: true }
    );

    if (result.ok === 1) {
        await createHistory({ owner: user._id, method: 'removed', target: 'item', addedDate: new Date(), quantity: 0, description: "Permanently removed" });

        for (const socket_id in global.currentConnections[user._id]) {
            global.currentConnections[user._id][socket_id].socket.emit('item_delete', _id);
        }
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
