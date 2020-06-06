const History = require('../models/history');

/**
 * Get all the user's history from the database.
 * @response { JSON, error? } array of history objects if successful otherwise, an error. 
 */
async function getAll(ctx) {
    try {
        const h = await History.findOne({ owner: ctx.state.user._id }, 'history');

        ctx.body = h.history;
    } catch (error) {
        ctx.throw(500, error);
    }
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

        const his = await History.findOne({ owner: ctx.state.user._id }, 'history');

        const rec = his.history.filter(hi => hi.addedDate.getTime() > fromDay.getTime());

        ctx.body = rec;
    } catch (error) {
        ctx.throw(500, error);
    }
}

/**
 * Creates a new history.
 * @param { method, target, addedDate, quantity, description } history 
 * @return { Promise<Document> } create's result.
 */
async function create(history) {
    try {
        const { owner = "", method = "", target = "", addedDate, quantity = 0, description = "" } = history;
        const result = await History.findOneAndUpdate(
            { owner },
            {
                $push: {
                    history: {
                        "$each": [{
                            method,
                            target,
                            addedDate,
                            quantity,
                            description,
                        }],
                        "$sort": { "created_at": -1 }
                    }
                }
            },
            { new: true, runValidators: true, rawResult: true }
        );

        return result;
    } catch (error) {
        throw (400, error);
    }
}

async function deleteAll(ctx) {
    try {
        const result = await History.findOneAndUpdate(
            { owner: ctx.state.user._id },
            { $pull: { history: {} } },
            { new: true, rawResult: true }
        );

        ctx.body = result.ok;
    } catch (error) {
        ctw.throw(500, error);
    }
}

module.exports = {
    getAll,
    getAllFromPastDays,
    create,
    deleteAll
};
