const Activity = require("../models/activity");
const createError = require("http-errors");

exports.init = async function (account_id, activity_id) {
  const result = await Activity.create({
    _id: activity_id,
    owner: account_id,
    activity: [
      {
        method: "create",
        target: "Account",
        quantity: 0,
        addedDate: new Date(),
        description: "Account created",
      },
    ],
  });
  return result;
};

/**
 * Creates a new activity.
 * @param { method, target, addedDate, quantity, description } activity
 * @return { Promise<Document> } create's result.
 */
exports.create = async function (activity) {
  const {
    owner = "",
    method = "",
    target = "",
    addedDate,
    quantity = 0,
    description = "",
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
    { new: true, runValidators: true, rawResult: true }
  );

  return result;
};

exports.deleteActivitiesByOwnerId = async function (_id) {
  return await Activity.deleteOne({ owner: _id });
};

/**
 * Get all the account's activities from the database.
 * @response { JSON, error? } array of activities objects if successful otherwise, an error.
 */
exports.activity_list = async function (req, res, next) {
  try {
    const activities = await Activity.aggregate([
      { $match: { owner: req.user } },
      { $unwind: "$activity" },
      {
        $project: {
          _id: "$activity._id",
          created_at: "$activity.created_at",
          method: "$activity.method",
          target: "$activity.target",
          addedDate: "$activity.addedDate",
          quantity: "$activity.quantity",
          description: "$activity.description",
        },
      },
    ]);
    res.status(200).json(activities);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Gets all items and activities from the database since the specified days.
 * @requires { number } days
 * @response { JSON, error? } An object that contains activities and items.
 */
exports.activity_list_period = async function (req, res, next) {
  try {
    const { days = 1 } = req.params;

    const fromDay = new Date();

    fromDay.setDate(fromDay.getDate() - days);
    fromDay.setHours(0, 0, 0, 0);

    const history = await Activity.findOne({ owner: req.user }, "activity");
    const activities = history.activity.filter(
      (hi) => hi.addedDate.getTime() > fromDay.getTime()
    );

    res.status(200).json(activities);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

exports.activity_delete = async function (req, res, next) {
  try {
    const result = await Activity.findOneAndUpdate(
      { owner: req.user },
      { $pull: { activity: {} } },
      { new: true, rawResult: true }
    );
    res.status(200).json(result.ok);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};
