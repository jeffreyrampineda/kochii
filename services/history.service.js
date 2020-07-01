const History = require('../models/history');

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
        throw (error);
    }
}

module.exports = {
    create,
};
