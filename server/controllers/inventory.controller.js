const debug = require('debug')('kochii:server-inventory.controller');
const Inventory = require('../models/inventory');
const ObjectId = require('mongoose').Types.ObjectId;
const activity_controller = require('../controllers/activity.controller');
const Validate = require('../validators/item');
const searchRawFood = require('../util/external_api.service').searchRawFood;
const io = require('../io');

const itemProject = {
  _id: '$items._id',
  name: '$items.name',
  cost: '$items.cost',
  quantity: '$items.quantity',
  addedDate: '$items.addedDate',
  expirationDate: '$items.expirationDate',
  group: '$items.group',
};

// Initializes a new inventory document.
exports.init = async function (accountId, inventoryId) {
  const result = await Inventory.create({
    _id: inventoryId,
    owner: accountId,
    groups: ['Default'],
    items: [
      {
        name: 'Sample',
        quantity: 1,
        cost: 0,
      },
    ],
  });

  await activity_controller.create({
    owner: accountId,
    method: 'add',
    target: 'item',
    addedDate: new Date(),
    quantity: 1,
    description: 'Item created',
  });

  return result;
};

exports.deleteInventoryByOwnerId = async function (_id) {
  return await Inventory.deleteOne({ owner: _id });
};

// Get all items.
exports.item_list = async function (req, res, next) {
  try {
    const result = await Inventory.aggregate([
      { $match: { owner: req.user } },
      { $unwind: '$items' },
      { $project: itemProject },
    ]);

    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Get all items starting with the specified pattern.
exports.item_list_search = async function (req, res, next) {
  try {
    const { name } = await Validate.searchByName(req.params);

    const i = await Inventory.findOne({ owner: req.user }, 'items');
    const re = new RegExp('^' + name);
    const result = i.items.filter((item) => re.test(item.name));
    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Get all items added between the given date belonging to req.user
exports.item_list_between_dates = async function (req, res, next) {
  try {
    const { startDate, endDate } = Validate.getAddedBetween(req.query);

    const startDateObject = new Date(startDate);
    startDateObject.setHours(0, 0, 0);
    endDateObject = new Date(endDate);
    endDateObject.setHours(23, 59, 59);

    const result = await Inventory.aggregate([
      { $match: { owner: req.user } },
      { $unwind: '$items' },
      {
        $match: {
          'items.addedDate': { $gte: startDateObject, $lte: endDateObject },
        },
      },
      { $project: itemProject },
    ]);
    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Get all items within the specified names list.
exports.item_list_names = async function (req, res, next) {
  try {
    const { refined } = await Validate.getByNames(req.query);

    const i = await Inventory.findOne({ owner: req.user }, 'items');
    const result = i.items.filter((item) => refined.includes(item.name));
    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

exports.item_nutrition = async function (req, res, next) {
  try {
    const { query } = req.query;

    const result = await searchRawFood(query);
    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Get item by _id.
exports.item_detail = async function (req, res, next) {
  try {
    const { _id } = req.params;

    const result = await Inventory.aggregate([
      { $match: { owner: req.user } },
      { $unwind: '$items' },
      { $match: { 'items._id': new ObjectId(_id) } },
      { $project: itemProject },
    ]);
    res.status(200).json(result[0]);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Creates a new item.
exports.item_create = async function (req, res, next) {
  try {
    const { name, quantity, cost, addedDate, expirationDate, group } =
      await Validate.create(req.body, req.user);

    const result = await Inventory.findOneAndUpdate(
      { owner: req.user },
      {
        $push: {
          items: {
            $each: [
              {
                name,
                quantity,
                cost,
                addedDate,
                expirationDate,
                group,
              },
            ],
            $position: 0,
          },
        },
      },
      { new: true, runValidators: true, rawResult: true },
    );

    if (result.ok === 1) {
      const item = result.value.items[0];

      await activity_controller.create({
        owner: req.user,
        method: 'add',
        target: 'item',
        addedDate: item.addedDate,
        quantity: item.quantity,
        description: 'Item created',
      });
      io.room(req.user.toString()).emit('item_create', item);
      //return item;
      res.status(200).json(item);
    } else {
      res.status(200).json(result.ok);
    }
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Updates an existing item. If the updated item's quantity is less than or
// equal to 0, delete the item.
exports.item_update = async function (req, res, next) {
  try {
    const {
      _id,
      name,
      quantity,
      cost,
      addedDate,
      expirationDate,
      group,
      option,
    } = await Validate.update(req.body, req.params, req.user);

    let itemData = {
      $set: {
        'items.$.name': name,
        'items.$.cost': cost,
        'items.$.addedDate': addedDate,
        'items.$.expirationDate': expirationDate,
        'items.$.group': group,
      },
      $inc: {},
    };

    // Setting or incrementing.
    itemData['$' + option]['items.$.quantity'] = quantity;

    const i = await Inventory.findOne(
      { owner: req.user, 'items._id': _id },
      { 'items.$': 1 },
    );
    const oldVItem = i.items[0];
    const result = await Inventory.findOneAndUpdate(
      {
        owner: req.user,
        'items._id': _id,
      },
      itemData,
      { new: true, runValidators: true, rawResult: true },
    );

    if (result.ok === 1) {
      const item = result.value.items.find((i) => i._id == _id);

      if (
        new Date(oldVItem.addedDate).getTime() !=
        new Date(item.addedDate).getTime()
      ) {
        await activity_controller.create({
          owner: req.user,
          method: 'delete',
          target: 'item',
          addedDate: oldVItem.addedDate,
          quantity: -oldVItem.quantity,
          description: 'Changed dates',
        });
        await activity_controller.create({
          owner: req.user,
          method: 'add',
          target: 'item',
          addedDate: item.addedDate,
          quantity: item.quantity,
          description: 'Changed dates',
        });
      }
      if (oldVItem.group != group) {
        await activity_controller.create({
          owner: req.user,
          method: 'edit',
          target: 'item',
          addedDate,
          quantity,
          description: 'Changed groups',
        });
      }
      if (option === 'set') {
        const newQuantity = item.quantity - oldVItem.quantity;

        if (newQuantity < 0) {
          await activity_controller.create({
            owner: req.user,
            method: 'delete',
            target: 'item',
            addedDate: new Date(),
            quantity: newQuantity,
            description: 'Updated item',
          });
        } else if (newQuantity > 0) {
          await activity_controller.create({
            owner: req.user,
            method: 'add',
            target: 'item',
            addedDate: item.addedDate,
            quantity: newQuantity,
            description: 'Updated item',
          });
        }
      }
      if (option === 'inc') {
        if (quantity <= 0) {
          await activity_controller.create({
            owner: req.user,
            method: 'delete',
            target: 'item',
            addedDate: new Date(),
            quantity,
            description: 'Decreased quantities',
          });
        } else {
          await activity_controller.create({
            owner: req.user,
            method: 'add',
            target: 'item',
            addedDate: item.addedDate,
            quantity,
            description: 'Increased quantities',
          });
        }
      }

      // If new quantity is less than or equal to 0, delete Item.
      if (item.quantity <= 0) {
        await deleteItemById(req.user, _id);
      } else {
        io.room(req.user.toString()).emit('item_update', item);
      }
      res.status(200).json(item);
    } else {
      res.status(200).json(result.ok);
    }
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Deletes an item by _id.
exports.item_delete = async function (req, res, next) {
  try {
    const { _id } = Validate.del(req.params, req.user);

    const result = { ok: await InventoryService.deleteItemById(req.user, _id) };
    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// -------------------------------------------------------------

// Deletes an item by _id.
async function deleteItemById(accountId, _id) {
  try {
    const result = await Inventory.findOneAndUpdate(
      { owner: accountId },
      { $pull: { items: { _id } } },
      { new: true, rawResult: true },
    );

    if (result.ok === 1) {
      await activity_controller.create({
        owner: accountId,
        method: 'removed',
        target: 'item',
        addedDate: new Date(),
        quantity: 0,
        description: 'Permanently removed',
      });
      // emits 'item_delete' to the connected socket(s).
      io.room(accountId.toString()).emit('item_delete', _id);
    }
    return result.ok;
  } catch (error) {
    throw error;
  }
}
