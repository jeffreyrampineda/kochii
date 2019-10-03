import HistoryModel from '../models/history';

class HistoryController {

    async getAll(ctx) {
        ctx.body = await HistoryModel.find();
    }

    async create(history) {
        await HistoryModel.create(history);
    }

/*     async delete(ctx) {
        ctx.body = await HistoryModel.deleteOne({ _id: ctx.params.id })
    } */

    async deleteAll(ctx) {
        ctx.body = await HistoryModel.deleteMany({});
    }
}

export default new HistoryController();