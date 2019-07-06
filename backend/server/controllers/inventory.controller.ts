import Item from '../models/item';
import Group from '../models/group';
import HistoryController from './history.controller';

class InventoryController {

    async getAll(ctx) {
        ctx.body = await Item.find().sort({ expirationDate: -1 });
    }

    async getGroups(ctx) {
        ctx.body = await Group.find();
    }

    async getItemsInGroup(ctx) {
        ctx.body = await Item.find({ group: ctx.params.groupName }).sort({ expirationDate: -1 });
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
        ctx.body = await Item.create(ctx.request.body);
    }

    /**
     * Creates a new group.
     * TODO: backend validation check - see if group already exists
     * @param ctx - Context
     */
    async createGroup(ctx) {
        ctx.body = await Group.create(ctx.request.body);
    }

    // TODO: Redesign for adding new items with measurements. 
        // Ex: same name and expiration but different measurement.
    async update(ctx) {
        try {
            if(ctx.request.body.quantity === 0) {
                throw new Error('Quantity is 0');
            }

            let itemData: any = {
                $set: { 
                    name: ctx.request.body.name, 
                    expirationDate: ctx.request.body.expirationDate,
                    quantityType: ctx.request.body.quantityType,
                    measurementPerQuantity: ctx.request.body.measurementPerQuantity,
                    measurementType: ctx.request.body.measurementType
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
                { upsert: true }
            )

            // If new item was created.
            if(!result) {
                HistoryController.create({ date: Date.now(), method: 'Create', target: ctx.request.body.name, description: '' })
            }

            // Otherwise, item was updated.
            else {
                // If old quantity + new quantity net to 0 OR new quantity == 0, delete Item.
                if (result.quantity + ctx.request.body.quantity <= 0 || ctx.request.body.quantity == 0) {
                    console.log("Removing item.");

                    HistoryController.create({ date: Date.now(), method: 'Remove', target: ctx.request.body.name, description: '' })
                    result = await Item.deleteOne({ _id: result.id });
                } else if (ctx.params.option==='inc') {

                    HistoryController.create({ date: Date.now(), method: 'Update', target: ctx.request.body.name, 
                        description: `${result.quantity} -> ${result.quantity + ctx.request.body.quantity}` })
                } else if (ctx.params.option==='set') {

                    HistoryController.create({ date: Date.now(), method: 'Update', target: ctx.request.body.name, 
                        description: `${result.quantity} -> ${ctx.request.body.quantity}` })
                }
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