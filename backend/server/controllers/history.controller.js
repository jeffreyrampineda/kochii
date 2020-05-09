const HistoryModel = require('../models/history');

class HistoryController {

    async getAll(ctx) {
        ctx.body = await HistoryModel.find();
    }

    async create(history) {
        await HistoryModel.create(history);
    }

    async deleteAll(ctx) {
        ctx.body = await HistoryModel.deleteMany({});
    }
}

module.exports = new HistoryController();
