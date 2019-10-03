import Item from '../models/item';
import Group from '../models/group';

class GroupController {
    async getAll(ctx) {
        ctx.body = await Group.find();
    }

    async getItems(ctx) {
        ctx.body = await Item.find({ group: ctx.params.groupName }).sort({ expirationDate: -1 });
    }

    /**
     * Creates a new group.
     * TODO: backend validation check - see if group already exists
     * @param ctx - Context
     */
    async create(ctx) {
        ctx.body = await Group.create(ctx.request.body);
    }

    async update(ctx) {
        let result = await Group.findOneAndUpdate(
            { name: ctx.request.body.name },
            { $inc : { size: ctx.request.body.size }},
        )

        ctx.body = result;
    }

    async delete(ctx) {
        ctx.body = await Group.deleteOne({ name: ctx.params.name });
    }

    async refreshSize(ctx) {
        const size = await Item.countDocuments({ group: ctx.params.name }, (err, count) => count);

        await Group.findOneAndUpdate(
            { name: ctx.params.name },
            { $set: { size }},
        )

        ctx.body = 'done';
    }
}

export default new GroupController();