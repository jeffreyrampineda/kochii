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
        ctx.body = await Item.findOne({ name: ctx.params.name })
    }

    async getById(ctx) {
        ctx.body = await Item.findOne({ _id: ctx.params.id })
    }

    async create(ctx) {
        console.log('creating item');

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
        try {
            console.log("updating item.");

            if(ctx.request.body.quantity === 0) {
                throw new Error('Quantity is 0');
            }

            let itemData: any = {
                $set: { 
                    name: ctx.request.body.name, 
                    expirationDate: ctx.request.body.expirationDate,
                    group: ctx.request.body.group,
                }
            }

            // Setting or incrementing ?
            if (ctx.params.option === 'inc') {
                itemData.$inc = { quantity: ctx.request.body.quantity }
            } else if (ctx.params.option === 'set') {
                itemData.$set.quantity = ctx.request.body.quantity
            } else {
                throw new Error('invalid option');
            }
    
            // Result is the previous value of Item. Null if Item is new.
            let result = await Item.findOneAndUpdate(
                { name: ctx.params.name, expirationDate: ctx.params.expirationDate },
                itemData,
                { upsert: true, new: true }
            )

            // If updating group.
            if (ctx.request.body.prevGroup && ctx.request.body.prevGroup !== result.group) {
                console.log('updating group.');
                // Find old group and decrement size by 1
                GroupController.update(
                    { request: { body: {
                        name: ctx.request.body.prevGroup,
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
            if (result.quantity + ctx.request.body.quantity <= 0 || ctx.request.body.quantity == 0) {
                console.log("removing item.");

                HistoryController.create({ date: Date.now(), method: 'Remove', target: ctx.request.body.name, description: '' })
                await GroupController.update(
                    { request: { body: {
                        name: ctx.request.body.group,
                        size: -1,
                    } } }
                );
                result = await Item.deleteOne({ _id: result.id });
            } else if (ctx.params.option==='inc') {

                HistoryController.create({ date: Date.now(), method: 'Update', target: ctx.request.body.name, 
                    description: `${result.quantity} -> ${result.quantity + ctx.request.body.quantity}` })
            } else if (ctx.params.option==='set') {

                HistoryController.create({ date: Date.now(), method: 'Update', target: ctx.request.body.name, 
                        description: `${result.quantity} -> ${ctx.request.body.quantity}` })
            }

            ctx.body = result;
        } catch(err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }

    }

    async delete(ctx) {
        ctx.body = await Item.deleteOne({ _id: ctx.params.id })
    }

    async deleteMany(ctx) {
        ctx.body = await Item.deleteMany({ _id: { $in: ctx.request.body }})
    }
}

export default new InventoryController();