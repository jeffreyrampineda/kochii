const History = require('../models/history');
const Inventory = require('../models/inventory');

async function getAll(ctx) {
    ctx.body = await History.find();
}

/**
 * Gets all items and history from the database since the specified days.
 * @requires { number } days
 * @response { JSON, error? } An object that contains history and items.
 */
async function getAllFromPastDays(ctx) {
    try {
        const { days = 1 } = ctx.params;
        const fromDay = new Date();
        
        fromDay.setDate(fromDay.getDate() - days);
        fromDay.setHours(0, 0, 0, 0);
    
        const his = await History.find({ date: { $gte: fromDay }});
        const inv = await Inventory.findOne({ owner: ctx.state.user }, 'items');
        const ite = inv.items.filter(it => it.addedDate.getTime() > fromDay.getTime());
    
        ctx.body = { history: his, items: ite };
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Creates a new history.
 * @param { method, target, quantityChange, description } history 
 * @return { Promise<Document> } create's result.
 */
async function create(history) {
    try {
        const result = await History.create(history);

        return result;
    } catch (error) {
        ctx.throw(400, error);
    } 
}

async function deleteAll(ctx) {
    ctx.body = await History.deleteMany({});
}

module.exports = {
    getAll,
    getAllFromPastDays,
    create,
    deleteAll
};
