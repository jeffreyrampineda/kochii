import Recipe from '../models/recipe';

class RecipesController {

    async getAll(ctx) {
        ctx.body = await Recipe.find();
    }

    async searchByName(ctx) {
        ctx.body = await Recipe.find({ name : {$regex: "^" + ctx.params.name } });
    }

    async getByName(ctx) {
        ctx.body = await Recipe.find({ name: ctx.params.name })
    }

    async getById(ctx) {
        ctx.body = await Recipe.findOne({ _id: ctx.params.id })
    }

    async create(ctx) {
        ctx.body = await Recipe.create(ctx.request.body);
    }

    async update(ctx) {
        ctx.body = await Recipe.findOneAndUpdate({ _id: ctx.params.id }, ctx.request.body)
    }

    async delete(ctx) {
        ctx.body = await Recipe.deleteOne({ _id: ctx.params.id })
    }
}

export default new RecipesController();