const debug = require('debug')('kochii:server-group.controller');
const Inventory = require('../models/inventory');
const activity_controller = require('../controllers/activity.controller');
const Validate = require('../validators/group');
const io = require('../io');

// Get all groups.
exports.group_list = async function (req, res, next) {
  try {
    const inventory = await Inventory.findOne({ owner: req.user }, 'groups');
    res.status(200).send(inventory.groups);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Creates a new group.
exports.group_create = async function (req, res, next) {
  try {
    const { name } = await Validate.create(req.params, req.user);

    const result = await Inventory.findOneAndUpdate(
      { owner: req.user },
      { $push: { groups: name } },
      { new: true, runValidators: true, rawResult: true },
    );

    if (result.ok === 1) {
      await activity_controller.create({
        owner: req.user,
        method: 'created',
        target: 'group',
        addedDate: new Date(),
        quantity: 0,
        description: 'Group created',
      });

      io.room(req.user.toString()).emit('group_create', name);
      res.status(200).json({ name });
    }
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Deletes a group.
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
          'items.$[i].group': 'Default',
        },

        // Remove group {name} from groups array
        $pull: { groups: name },
      },
      {
        arrayFilters: [{ 'i.group': name }],
        new: true,
        runValidators: true,
      },
    );

    // Updating client's inventory
    const updated_default_group = result.items.filter(
      (item) => item.group === 'Default',
    );

    io.room(req.user.toString()).emit('item_updateMany', updated_default_group);
    io.room(req.user.toString()).emit('group_delete', name);

    // Create new activity.
    await activity_controller.create({
      owner: req.user,
      method: 'removed',
      target: 'group',
      addedDate: new Date(),
      quantity: 0,
      description: 'Permanently removed',
    });
    res.status(200).json({ name });
  } catch (error) {
    debug('Error');

    next(error);
  }
};
