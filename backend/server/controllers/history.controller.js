const History = require('../models/history');

async function getAll(ctx) {
    ctx.body = await History.find();
}

async function create(history) {
    await History.create(history);
}

async function deleteAll(ctx) {
    ctx.body = await History.deleteMany({});
}

module.exports = {
    getAll,
    create,
    deleteAll
};
