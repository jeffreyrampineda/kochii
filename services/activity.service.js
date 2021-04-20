const Activity = require('../models/activity');

const activityProject = {
    '_id': '$activity._id',
    'created_at': '$activity.created_at',
    'method': '$activity.method',
    'target': '$activity.target',
    'addedDate': '$activity.addedDate',
    'quantity': '$activity.quantity',
    'description': '$activity.description'
};

async function init(account_id, activity_id) {
    try {
        await Activity.create({
            _id: activity_id,
            owner: account_id,
            activity: [{
                method: "create",
                target: "Account",
                quantity: 0,
                addedDate: new Date(),
                description: "Account created",
            }]
        });

        return true;
    } catch (error) {
        throw (error);
    }
}

/**
 * Get all activities belonging to account_id.
 * @param { JSON } account_id
 */
async function getActivities(account_id) {
    try {
        const activities = await Activity.aggregate([
            { $match: { owner: account_id } },
            { $unwind: '$activity' },
            { $project: activityProject }
        ]);

        return activities;
    } catch (error) {
        throw (error);
    }
}

async function getActivitiesSince(account_id, days) {
    try {
        const fromDay = new Date();

        fromDay.setDate(fromDay.getDate() - days);
        fromDay.setHours(0, 0, 0, 0);

        const his = await Activity.findOne({ owner: account_id }, 'activity');

        return his.activity.filter(hi => hi.addedDate.getTime() > fromDay.getTime());
    } catch (error) {
        throw (error);
    }
}

/**
 * Creates a new activity.
 * @param { method, target, addedDate, quantity, description } activity 
 * @return { Promise<Document> } create's result.
 */
async function create(activity) {
    try {
        const { owner = "", method = "", target = "", addedDate, quantity = 0, description = "" } = activity;
        const result = await Activity.findOneAndUpdate(
            { owner },
            {
                $push: {
                    activity: {
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

async function clearActivities(account_id) {
    try {
        const result = await Activity.findOneAndUpdate(
            { owner: account_id },
            { $pull: { activity: {} } },
            { new: true, rawResult: true }
        );
        return result.ok;
    } catch (error) {
        throw (error);
    }
}

async function deleteActivitiesByOwnerId(_id) {
    try {
        return await Activity.deleteOne({ owner: _id });
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    init,
    getActivities,
    getActivitiesSince,
    create,
    clearActivities,
    deleteActivitiesByOwnerId,
};
