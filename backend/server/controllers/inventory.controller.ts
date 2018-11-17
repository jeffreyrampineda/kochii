class InventoryController {

    async getInventory(ctx) {
        ctx.body = {message: "hello inventory"}
    }
}

export default new InventoryController();