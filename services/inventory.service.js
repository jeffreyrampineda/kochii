const Inventory = require('../models/inventory');
const ObjectId = require('mongoose').Types.ObjectId;
const createHistory = require('../services/history.service').create;

const itemProject = {
    '_id': '$items._id',
    'name': '$items.name',
    'cost': '$items.cost',
    'quantity': '$items.quantity',
    'addedDate': '$items.addedDate',
    'expirationDate': '$items.expirationDate',
    'group': '$items.group'
};

async function init(user, inventory_id) {
    try {
        await Inventory.create({
            _id: inventory_id,
            owner: user._id,
            groups: ["Default"],
            items: [{
                name: "Sample",
                quantity: 1,
                cost: 0,
            }]
        });

        await createHistory({ owner: user._id, method: 'add', target: 'item', addedDate: new Date(), quantity: 1, description: "Item created" });

        return true;
    } catch (error) {
        throw (error);
    }
}

/**
 * Get all items belonging to user.
 * @param { JSON } user
 */
async function getItems(user) {
    try {
        const items = await Inventory.aggregate([
            { $match: { owner: user._id } },
            { $unwind: '$items' },
            { $project: itemProject }
        ]);

        return items;
    } catch (error) {
        throw (error);
    }
}

async function getItemById(user, _id) {
    try {
        const item = await Inventory.aggregate([
            { $match: { owner: user._id } },
            { $unwind: '$items' },
            { $match: { 'items._id': ObjectId(_id) }},
            { $project: itemProject }
        ]);

        return item[0];
    } catch (error) {
        throw (error);
    }
}

/**
 * Get all items added between the given date belonging to the specified user.
 * @param { object } user 
 * @param { date } startDate 
 * @param { date } endDate 
 */
async function getItemsAddedBetween(user, startDate, endDate) {
    try {
        startDate = new Date(startDate);
        startDate.setHours(0, 0, 0);
        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59);

        const items = await Inventory.aggregate([
            { $match: { owner: user._id } },
            { $unwind: '$items' },
            { $match: { 'items.addedDate': { $gte: startDate, $lte: endDate }}},
            { $project: itemProject }
        ]);

        return items;
    } catch (error) {
        throw (error);
    }
}

async function getItemsByNames(user, refined) {
    try {
        const i = await Inventory.findOne({ owner: user._id }, 'items');
        const result = i.items.filter(item => refined.includes(item.name));

        return result;
    } catch (error) {
        throw (error);
    }
}

async function searchItemByName(user, name) {
    try {
        const i = await Inventory.findOne({ owner: user._id }, 'items');
        const re = new RegExp("^" + name);
        const result = i.items.filter(item => re.test(item.name));

        return result;
    } catch (error) {
        throw (error);
    }
}

async function createItem(user, name, quantity, cost, addedDate, expirationDate, group) {
    try {
        const g = await Inventory.findOne({
            owner: user._id,
            "items.name": name,
        }, 'items');

        if (g && g.items) {
            const h = g.items.find(it => (new Date(it.expirationDate)).toDateString() == (new Date(expirationDate).toDateString()))

            if (h) {
                return await updateItem(user, String(h._id), name, quantity, cost, (new Date(addedDate).toDateString()), (new Date(expirationDate).toDateString()), group, 'inc');
            }
        }

        const result = await Inventory.findOneAndUpdate(
            { owner: user._id },
            {
                $push: {
                    items: {
                        $each: [{
                            name,
                            quantity,
                            cost,
                            addedDate,
                            expirationDate,
                            group
                        }],
                        $position: 0
                    }
                }
            },
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok === 1) {
            const item = result.value.items[0];

            await createHistory({ owner: user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: item.quantity, description: "Item created" });

            for (const socket_id in global.currentConnections[user._id]) {
                global.currentConnections[user._id][socket_id].socket.emit('item_create', item);
            }
            return item;
        } else {
            return result.ok;
        }
    } catch (error) {
        throw (error);
    }
}

async function updateItem(user, _id, name, quantity, cost, addedDate, expirationDate, group, option) {
    try {
        let itemData = {
            $set: {
                "items.$.name": name,
                "items.$.cost": cost,
                "items.$.addedDate": addedDate,
                "items.$.expirationDate": expirationDate,
                "items.$.group": group
            },
            $inc: {}
        }

        // Setting or incrementing.
        itemData["$" + option]["items.$.quantity"] = quantity;

        const i = await Inventory.findOne({ owner: user._id, "items._id": _id }, { 'items.$': 1 });
        const oldVItem = i.items[0];
        const result = await Inventory.findOneAndUpdate(
            {
                owner: user._id,
                "items._id": _id
            },
            itemData,
            { new: true, runValidators: true, rawResult: true }
        );

        if (result.ok === 1) {
            const item = result.value.items.find(i => i._id == _id);

            if ((new Date(oldVItem.addedDate)).getTime() != (new Date(item.addedDate)).getTime()) {
                await createHistory({ owner: user._id, method: 'delete', target: 'item', addedDate: oldVItem.addedDate, quantity: -oldVItem.quantity, description: "Changed dates" });
                await createHistory({ owner: user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: item.quantity, description: "Changed dates" });
            }
            if (oldVItem.group != group) {
                await createHistory({ owner: user._id, method: 'edit', target: 'item', addedDate, quantity, description: "Changed groups" });
            }
            if (option === 'set') {
                const newQuantity = item.quantity - oldVItem.quantity;

                if (newQuantity < 0) {
                    await createHistory({ owner: user._id, method: 'delete', target: 'item', addedDate: new Date(), quantity: newQuantity, description: "Updated item" });

                } else if (newQuantity > 0) {
                    await createHistory({ owner: user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity: newQuantity, description: "Updated item" });
                }

            }
            if (option === 'inc') {
                if (quantity <= 0) {
                    await createHistory({ owner: user._id, method: 'delete', target: 'item', addedDate: new Date(), quantity, description: "Decreased quantities" });
                } else {
                    await createHistory({ owner: user._id, method: 'add', target: 'item', addedDate: item.addedDate, quantity, description: "Increased quantities" });
                }
            }

            // If new quantity is less than or equal to 0, delete Item.
            if (item.quantity <= 0) {
                await deleteItemById(_id, user);
            } else {
                for (const socket_id in global.currentConnections[user._id]) {
                    global.currentConnections[user._id][socket_id].socket.emit('item_update', item);
                }
            }
            return item;
        } else {
            return result.ok;
        }
    } catch (error) {
        throw (error);
    }
}

/**
 * Deletes an item by _id. If successful, emits 'item_delete' to the
 * connected socket(s).
 * @param { string } _id 
 * @returns { number } delete's result.
 */
async function deleteItemById(_id, user) {
    try {
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
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    init,
    getItems,
    getItemById,
    getItemsAddedBetween,
    getItemsByNames,
    searchItemByName,
    createItem,
    updateItem,
    deleteItemById
}