import Item from '../models/item';

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
        ctx.body = await Item.create(ctx.request.body);
    }

    async update(ctx) {
        try {
            if(ctx.request.body.quantity === 0) {
                throw new Error('Quantity is 0');
            }

            let itemData: any = {
                $set: { 
                    name: ctx.request.body.name, 
                    expirationDate: ctx.request.body.expirationDate
                }
            }

            // Setting or incrementing ?
            switch(ctx.params.option) {
                case 'inc':
                    itemData.$inc = {
                        quantity: ctx.request.body.quantity
                    }
                    break;
                
                // default to set.
                default:
                    itemData.$set.quantity = ctx.request.body.quantity
                    break;
            }
    
            // Result is the previous value of Item. Null if Item is new.
            let result = await Item.findOneAndUpdate(
                { name: ctx.params.name, expirationDate: ctx.params.expirationDate },
                itemData,
                { upsert: true }
            )
    
            // If inc and old quantity + new quantity net to 0, delete Item.
            // If set and new quantity == 0, delete Item.
            if(result && 
                    (ctx.params.option==='inc' && result.quantity + ctx.request.body.quantity <= 0) ||
                    (ctx.params.option==='set' && ctx.request.body.quantity == 0)
                ) {
                console.log("Removing item.");
                result = await Item.deleteOne({ _id: result.id });
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