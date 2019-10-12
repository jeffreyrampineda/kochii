import Item from '../models/item';
import HistoryController from './history.controller';
import GroupController from './group.controller';

class InventoryController {

    async getAll(ctx) {
        ctx.body = await Item.find().sort({ expirationDate: -1 });
    }

    async getByNames(ctx) {
        let names = ctx.query.names.split(',');
        ctx.body = await Item.find({ name: { $in: names } })
    }

    async searchByName(ctx) {
        ctx.body = await Item.find({ name: { $regex: "^" + ctx.params.name } });
    }

    async getByName(ctx) {
        const name = ctx.params.name;

        ctx.body = await Item.findOne({ name, });
    }

    async getById(ctx) {
        ctx.body = await Item.findOne({ _id: ctx.params.id })
    }

    async create(ctx) {
        console.log('creating item');

        if(ctx.request.body.quantity === 0) {
            ctx.throw(400, 'Quantity cannot be 0');
        }

        let result = await Item.create(ctx.request.body);

        if (result) {
            GroupController.update(
                { request: { body: {
                      name: result.group,
                      size: 1,
                  } } }
            );
            HistoryController.create({ date: Date.now(), method: 'Create', target: result.name, description: '' });
        }

        ctx.body = result;
    }

    async update(ctx) {
        console.log("updating item.");
        const { name, quantity, expirationDate, group, prevGroup } = ctx.request.body;

        if(quantity === 0) {
            ctx.throw(400, 'Quantity cannot be 0');
        }

        let itemData: any = {
            $set: { 
                name, 
                expirationDate,
                group,
            }
        }

        // Setting or incrementing ?
        if (ctx.params.option === 'inc') {
            itemData.$inc = { quantity, }
        } else if (ctx.params.option === 'set') {
            itemData.$set.quantity = quantity;
        } else {
            ctx.throw(400, 'Invalid option');
        }
    
        // Result is the previous value of Item. Null if Item is new.
        let result = await Item.findOneAndUpdate(
            { name: ctx.params.name, expirationDate: ctx.params.expirationDate },
            itemData,
            { upsert: true, new: true }
        )

        // If updating group.
        if (prevGroup && prevGroup !== result.group) {
            console.log('updating group.');
            // Find old group and decrement size by 1
            GroupController.update(
                { request: { body: {
                    name: prevGroup,
                    size: -1,
                } } }
            );

            // Find new group and increment size by 1
            GroupController.update(
                { request: { body: {
                    name: result.group,
                    size: 1,
                } } }
            );
        }

        // If old quantity + new quantity net to 0 OR new quantity == 0, delete Item.
        if (result.quantity + quantity <= 0 || quantity == 0) {
            console.log("removing item.");

            HistoryController.create({ date: Date.now(), method: 'Remove', target: name, description: '' })
            await GroupController.update(
                { request: { body: {
                    name: group,
                    size: -1,
                } } }
            );
            result = await Item.deleteOne({ _id: result.id });
        } else if (ctx.params.option==='inc') {

            HistoryController.create({ date: Date.now(), method: 'Update', target: name, 
                description: `${result.quantity} -> ${result.quantity + quantity}` })
        } else if (ctx.params.option==='set') {

            HistoryController.create({ date: Date.now(), method: 'Update', target: name, 
                description: `${result.quantity} -> ${quantity}` })
        }

        ctx.body = result;
    }

    async delete(ctx) {
        ctx.body = await Item.deleteOne({ _id: ctx.params.id })
    }

    async deleteMany(ctx) {
        ctx.body = await Item.deleteMany({ _id: { $in: ctx.request.body }})
    }
}

export default new InventoryController();