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

async function create(ctx) {
    console.log('creating item');

    if (ctx.request.body.quantity === 0) {
        ctx.throw(400, 'Quantity cannot be 0');
    }

    let result = await Item.create(ctx.request.body);

    if (result) {
        global.io.sockets.emit('item_create', result);
        HistoryController.create({ date: Date.now(), method: 'Create', target: result.name, description: '' });
    }

    ctx.body = result;
}

async function update(ctx) {
    console.log("updating item.");
    const { _id, name, quantity, expirationDate, group } = ctx.request.body;

    if (quantity === 0) {
        ctx.throw(400, 'Quantity cannot be 0');
    }

    let itemData = {
        $set: {
            name,
            expirationDate,
            group,
        }
    }

    // Setting or incrementing ?
    if (ctx.params.option === 'inc') {
        itemData.$inc = { quantity, };
    } else if (ctx.params.option === 'set') {
        itemData.$set = { quantity, };
    } else {
        ctx.throw(400, 'Invalid option');
    }

    // Result is the previous value of Item. Null if Item is new.
    let result = await Item.findOneAndUpdate(
        { _id },
        itemData,
        { upsert: true, new: true, useFindAndModify: false }
    );

    // If new quantity is less than or equal to 0, delete Item.
    if (result.quantity <= 0) {
        let del_result = await Item.deleteOne({ _id });

        if (del_result.ok === 1) {
            global.io.sockets.emit('item_remove', _id);
            HistoryController.create({ date: Date.now(), method: 'Remove', target: name, description: '' });
        }
    } else if (ctx.params.option === 'inc') {
        global.io.sockets.emit('item_update', result);

        HistoryController.create({
            date: Date.now(), method: 'Update', target: name,
            description: `${result.quantity} -> ${result.quantity + quantity}`
        });
    } else if (ctx.params.option === 'set') {
        global.io.sockets.emit('item_update', result);

        HistoryController.create({
            date: Date.now(), method: 'Update', target: name,
            description: `${result.quantity} -> ${quantity}`
        });
    }

    ctx.body = result;
}

module.exports = {
    getAll,
    searchByName,
    getByNames,
    create,
    update
};
