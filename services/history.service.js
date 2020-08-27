const History = require('../models/history');

async function init(user, history_id) {
    try {
        await History.create({
            _id: history_id,
            owner: user._id,
            history: [{
                method: "create",
                target: "user",
                quantity: 0,
                addedDate: new Date(),
                description: "Account registered",
            }]
        });

        return true;
    } catch (error) {
        throw (error);
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
        throw (error);
    }
}

async function deleteHistoryByOwnerId(_id) {
    try {
        return await History.deleteOne({ owner: _id });
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    init,
    create,
    deleteHistoryByOwnerId,
};
