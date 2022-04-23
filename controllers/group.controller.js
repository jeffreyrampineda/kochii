const Inventory = require("../models/inventory");
const createActivity = require("../services/activity.service").create;
const Validate = require("../validators/group");
const createError = require("http-errors");

/**
 * Get all groups from the database.
 * @response { string[], error? } array of strings if successful otherwise, an error.
 */
exports.group_list = async function (req, res, next) {
  try {
    const inventory = await Inventory.findOne(
      { owner: req.user._id },
      "groups"
    );
    res.status(200).send(inventory.groups);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Creates a new group.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
exports.group_create = async function (req, res, next) {
  try {
    const { name } = await Validate.create(req.params, req.user);

    const result = await Inventory.findOneAndUpdate(
      { owner: req.user },
      { $push: { groups: name } },
      { new: true, runValidators: true, rawResult: true }
    );

    if (result.ok === 1) {
      await createActivity({
        owner: req.user,
        method: "created",
        target: "group",
        addedDate: new Date(),
        quantity: 0,
        description: "Group created",
      });

      for (const socket_id in global.currentConnections[req.user]) {
        global.currentConnections[req.user][socket_id].socket.emit(
          "group_create",
          name
        );
      }
      res.status(200).json({ name });
    }
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Deletes a group. Before deleting, set all Items' group with the same group name
 * to 'Default'.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
exports.group_delete = async function (req, res, next) {
  try {
    const { name } = await Validate.del(req.params, req.user);

    const result = await Inventory.findOneAndUpdate(
      {
        owner: req.user,
      },
      {
        // Set items with group {name} to "Default"
        $set: {
          "items.$[i].group": "Default",
        },

        // Remove group {name} from groups array
        $pull: { groups: name },
      },
      {
        arrayFilters: [{ "i.group": name }],
        new: true,
        runValidators: true,
      }
    );

    // Updating client's inventory
    const updated_default_group = result.items.filter(
      (item) => item.group === "Default"
    );
    for (const socket_id in global.currentConnections[req.user]) {
      global.currentConnections[req.user][socket_id].socket.emit(
        "item_updateMany",
        updated_default_group
      );
      global.currentConnections[req.user][socket_id].socket.emit(
        "group_delete",
        name
      );
    }

    // Create new activity for recording
    await createActivity({
      owner: req.user,
      method: "removed",
      target: "group",
      addedDate: new Date(),
      quantity: 0,
      description: "Permanently removed",
    });
    res.status(200).json({ name });
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};
