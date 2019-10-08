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
        const { name, size, } = ctx.request.body;

        let result = await Group.findOneAndUpdate(
            { name, },
            { $inc : { size, }},
        )

        ctx.body = result;
    }

    async delete(ctx) {
        ctx.body = await Group.deleteOne({ name: ctx.params.name });
    }

    async refreshSize(ctx) {
        const name = ctx.params.name;
        const size = await Item.countDocuments({ group: name }, (err, count) => count);

        await Group.findOneAndUpdate(
            { name, },
            { $set: { size, }},
        )

        ctx.body = 'done';
    }
}

export default new GroupController();