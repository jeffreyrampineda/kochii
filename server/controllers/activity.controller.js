const debug = require('debug')('kochii:server-activity.controller');
const Activity = require('../models/activity');

// Initializes a new activity document.
exports.init = async function (accountId, activityId) {
  const result = await Activity.create({
    _id: activityId,
    owner: accountId,
    activity: [
      {
        method: 'create',
        target: 'Account',
        quantity: 0,
        addedDate: new Date(),
        description: 'Account created',
      },
    ],
  });
  return result;
};

// Creates a new activity entry.
exports.create = async function (activity) {
  const {
    owner = '',
    method = '',
    target = '',
    addedDate,
    quantity = 0,
    description = '',
  } = activity;
  const result = await Activity.findOneAndUpdate(
    { owner },
    {
      $push: {
        activity: {
          $each: [
            {
              method,
              target,
              addedDate,
              quantity,
              description,
            },
          ],
          $sort: { created_at: -1 },
        },
      },
    },
    { new: true, runValidators: true, rawResult: true },
  );

  return result;
};

exports.deleteActivitiesByOwnerId = async function (_id) {
  return await Activity.deleteOne({ owner: _id });
};

// Get all activity entries.
exports.activity_list = async function (req, res, next) {
  try {
    const activities = await Activity.aggregate([
      { $match: { owner: req.user } },
      { $unwind: '$activity' },
      {
        $project: {
          _id: '$activity._id',
          created_at: '$activity.created_at',
          method: '$activity.method',
          target: '$activity.target',
          addedDate: '$activity.addedDate',
          quantity: '$activity.quantity',
          description: '$activity.description',
        },
      },
    ]);
    res.status(200).json(activities);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Gets all activity entries since the specified days.
exports.activity_list_period = async function (req, res, next) {
  try {
    const { days = 1 } = req.params;

    const fromDay = new Date();

    fromDay.setDate(fromDay.getDate() - days);
    fromDay.setHours(0, 0, 0, 0);

    const history = await Activity.findOne({ owner: req.user }, 'activity');
    const activities = history.activity.filter(
      (hi) => hi.addedDate.getTime() > fromDay.getTime(),
    );

    res.status(200).json(activities);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Clear activity document.
exports.activity_delete = async function (req, res, next) {
  try {
    const result = await Activity.findOneAndUpdate(
      { owner: req.user },
      { $pull: { activity: {} } },
      { new: true, rawResult: true },
    );
    res.status(200).json(result.ok);
  } catch (error) {
    debug('Error');

    next(error);
  }
};
