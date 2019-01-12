import Item from '../models/item';

class InventoryController {

    async getAll(ctx) {
        ctx.body = await Item.find().sort({ expirationDate: -1 });
    }

    async searchByName(ctx) {
        ctx.body = await Item.find({ name : { $regex: "^" + ctx.params.name } });
    }

    async getByName(ctx) {
        ctx.body = await Item.findOne({ name: ctx.params.name })
    }

    async getByNameAndExpirationDate(ctx) {
        ctx.body = await Item.findOne({ name: ctx.params.name, expirationDate: ctx.params.expirationDate });
    }

    async getById(ctx) {
        ctx.body = await Item.findOne({ _id: ctx.params.id })
    }

    async create(ctx) {
        ctx.body = await Item.create(ctx.request.body);
    }

    async update(ctx) {
        ctx.body = await Item.findOneAndUpdate({ _id: ctx.params.id }, ctx.request.body)
    }

    async delete(ctx) {
        ctx.body = await Item.deleteOne({ _id: ctx.params.id })
    }

    async deleteMany(ctx) {
        ctx.body = await Item.deleteMany({ _id: { $in: ctx.request.body }})
    }
}

export default new InventoryController();