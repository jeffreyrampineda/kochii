const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory");
const createActivity = require("../services/activity.service").create;
const Validate = require("../validators/group");

/**
 * GET /api/groups
 * Get all groups from the database.
 * @response { string[], error? } array of strings if successful otherwise, an error.
 */
router.get("/", async function (req, res) {
  try {
    const inventory = await Inventory.findOne(
      { owner: req.user._id },
      "groups"
    );
    res.status(200).send(inventory.groups);
  } catch (error) {
    res.status(error.status ?? 500).json(error);
  }
});

/**
 * POST /api/groups/:name
 * Creates a new group.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
router.post("/:name", async function (req, res) {
  try {
    const { errors, name } = await Validate.create(req.params, req.user);

    if (Object.keys(errors).length) {
      throw { status: 400, ...errors };
    }

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
    res.status(error.status ?? 500).json(error);
  }
});

/**
 * DEL /api/groups/:name
 * Deletes a group. Before deleting, sets all Items' group with the same group name
 * to 'Default'.
 * @requires { params } name
 * @response { JSON, error? } group's name if successful otherwise, an error.
 */
router.delete("/:name", async function (req, res) {
  try {
    const { errors, name } = await Validate.del(req.params, req.user);

    if (Object.keys(errors).length) {
      throw { status: 400, ...errors };
    }

    const item_result = await Inventory.findOneAndUpdate(
      {
        owner: req.user,
      },
      {
        $set: {
          "items.$[i].group": "Default",
        },
      },
      {
        arrayFilters: [{ "i.group": name }],
        new: true,
        runValidators: true,
        rawResult: true,
      }
    );

    if (item_result.ok === 1) {
      const i = await Inventory.findOne({ owner: req.user }, "items");
      const result = i.items.filter((item) => item.group === "Default");
      for (const socket_id in global.currentConnections[req.user]) {
        global.currentConnections[req.user][socket_id].socket.emit(
          "item_updateMany",
          result
        );
      }
    }

    const result = await Inventory.findOneAndUpdate(
      { owner: req.user },
      { $pull: { groups: name } },
      { new: true, rawResult: true }
    );

    if (result.ok === 1) {
      await createActivity({
        owner: req.user,
        method: "removed",
        target: "group",
        addedDate: new Date(),
        quantity: 0,
        description: "Permanently removed",
      });

      for (const socket_id in global.currentConnections[req.user]) {
        global.currentConnections[req.user][socket_id].socket.emit(
          "group_delete",
          name
        );
      }
      res.status(200).json({ name });
    }
  } catch (error) {
    res.status(error.status ?? 500).json(error);
  }
});

module.exports = router;
