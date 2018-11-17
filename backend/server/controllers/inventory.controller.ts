import Item from '../models/item';

class InventoryController {

    async getInventory(ctx) {
        ctx.body = await Item.find();
    }
}

export default new InventoryController();