const Recipe = require('../models/recipe');

async function getAll(ctx) {
    ctx.body = await Recipe.find();
}

async function searchByName(ctx) {
    ctx.body = await Recipe.find({ name: { $regex: "^" + ctx.params.name } });
}

async function getByName(ctx) {
    const name = ctx.params.name;

    ctx.body = await Recipe.findOne({ name, });
}

async function getById(ctx) {
    ctx.body = await Recipe.findOne({ _id: ctx.params.id });
}

async function create(ctx) {
    ctx.body = await Recipe.create(ctx.request.body);
}

async function update(ctx) {
    ctx.body = await Recipe.findOneAndUpdate({ _id: ctx.params.id }, ctx.request.body);
}

async function del(ctx) {
    ctx.body = await Recipe.deleteOne({ _id: ctx.params.id });
}

module.exports = {
    getAll,
    searchByName,
    getById,
    getByName,
    create,
    update,
    del
};
