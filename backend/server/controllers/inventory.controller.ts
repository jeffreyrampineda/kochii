import Item from '../models/item';

class InventoryController {

    async getInventory(ctx) {
        ctx.body = await Item.find();
    }

    async searchItemByName(ctx) {
        ctx.body = await Item.find({ name : {$regex: "^" + ctx.params.name } });
    }
}

export default new InventoryController();