const Inventory = require("../models/inventory");
const ObjectId = require("mongoose").Types.ObjectId;
const createActivity = require("../services/activity.service").create;

const itemProject = {
  _id: "$items._id",
  name: "$items.name",
  cost: "$items.cost",
  quantity: "$items.quantity",
  addedDate: "$items.addedDate",
  expirationDate: "$items.expirationDate",
  group: "$items.group",
};

async function init(account_id, inventory_id) {
  try {
    await Inventory.create({
      _id: inventory_id,
      owner: account_id,
      groups: ["Default"],
      items: [
        {
          name: "Sample",
          quantity: 1,
          cost: 0,
        },
      ],
    });

    await createActivity({
      owner: account_id,
      method: "add",
      target: "item",
      addedDate: new Date(),
      quantity: 1,
      description: "Item created",
    });

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all items belonging to account_id.
 * @param { JSON } account_id
 */
async function getItems(account_id) {
  try {
    const items = await Inventory.aggregate([
      { $match: { owner: account_id } },
      { $unwind: "$items" },
      { $project: itemProject },
    ]);

    return items;
  } catch (error) {
    throw error;
  }
}

async function getItemById(account_id, _id) {
  try {
    const item = await Inventory.aggregate([
      { $match: { owner: account_id } },
      { $unwind: "$items" },
      { $match: { "items._id": ObjectId(_id) } },
      { $project: itemProject },
    ]);

    return item[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get all items added between the given date belonging to account_id.
 * @param { object } account_id
 * @param { date } startDate
 * @param { date } endDate
 */
async function getItemsAddedBetween(account_id, startDate, endDate) {
  try {
    startDate = new Date(startDate);
    startDate.setHours(0, 0, 0);
    endDate = new Date(endDate);
    endDate.setHours(23, 59, 59);

    const items = await Inventory.aggregate([
      { $match: { owner: account_id } },
      { $unwind: "$items" },
      { $match: { "items.addedDate": { $gte: startDate, $lte: endDate } } },
      { $project: itemProject },
    ]);

    return items;
  } catch (error) {
    throw error;
  }
}

async function getItemsByNames(account_id, refined) {
  try {
    const i = await Inventory.findOne({ owner: account_id }, "items");
    const result = i.items.filter((item) => refined.includes(item.name));

    return result;
  } catch (error) {
    throw error;
  }
}

async function searchItemByName(account_id, name) {
  try {
    const i = await Inventory.findOne({ owner: account_id }, "items");
    const re = new RegExp("^" + name);
    const result = i.items.filter((item) => re.test(item.name));

    return result;
  } catch (error) {
    throw error;
  }
}

async function createItem(
  account_id,
  name,
  quantity,
  cost,
  addedDate,
  expirationDate,
  group
) {
  try {
    const result = await Inventory.findOneAndUpdate(
      { owner: account_id },
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
      { new: true, runValidators: true, rawResult: true }
    );

    if (result.ok === 1) {
      const item = result.value.items[0];

      await createActivity({
        owner: account_id,
        method: "add",
        target: "item",
        addedDate: item.addedDate,
        quantity: item.quantity,
        description: "Item created",
      });

      for (const socket_id in global.currentConnections[account_id]) {
        global.currentConnections[account_id][socket_id].socket.emit(
          "item_create",
          item
        );
      }
      return item;
    } else {
      return result.ok;
    }
  } catch (error) {
    throw error;
  }
}

async function updateItem(
  account_id,
  _id,
  name,
  quantity,
  cost,
  addedDate,
  expirationDate,
  group,
  option
) {
  try {
    let itemData = {
      $set: {
        "items.$.name": name,
        "items.$.cost": cost,
        "items.$.addedDate": addedDate,
        "items.$.expirationDate": expirationDate,
        "items.$.group": group,
      },
      $inc: {},
    };

    // Setting or incrementing.
    itemData["$" + option]["items.$.quantity"] = quantity;

    const i = await Inventory.findOne(
      { owner: account_id, "items._id": _id },
      { "items.$": 1 }
    );
    const oldVItem = i.items[0];
    const result = await Inventory.findOneAndUpdate(
      {
        owner: account_id,
        "items._id": _id,
      },
      itemData,
      { new: true, runValidators: true, rawResult: true }
    );

    if (result.ok === 1) {
      const item = result.value.items.find((i) => i._id == _id);

      if (
        new Date(oldVItem.addedDate).getTime() !=
        new Date(item.addedDate).getTime()
      ) {
        await createActivity({
          owner: account_id,
          method: "delete",
          target: "item",
          addedDate: oldVItem.addedDate,
          quantity: -oldVItem.quantity,
          description: "Changed dates",
        });
        await createActivity({
          owner: account_id,
          method: "add",
          target: "item",
          addedDate: item.addedDate,
          quantity: item.quantity,
          description: "Changed dates",
        });
      }
      if (oldVItem.group != group) {
        await createActivity({
          owner: account_id,
          method: "edit",
          target: "item",
          addedDate,
          quantity,
          description: "Changed groups",
        });
      }
      if (option === "set") {
        const newQuantity = item.quantity - oldVItem.quantity;

        if (newQuantity < 0) {
          await createActivity({
            owner: account_id,
            method: "delete",
            target: "item",
            addedDate: new Date(),
            quantity: newQuantity,
            description: "Updated item",
          });
        } else if (newQuantity > 0) {
          await createActivity({
            owner: account_id,
            method: "add",
            target: "item",
            addedDate: item.addedDate,
            quantity: newQuantity,
            description: "Updated item",
          });
        }
      }
      if (option === "inc") {
        if (quantity <= 0) {
          await createActivity({
            owner: account_id,
            method: "delete",
            target: "item",
            addedDate: new Date(),
            quantity,
            description: "Decreased quantities",
          });
        } else {
          await createActivity({
            owner: account_id,
            method: "add",
            target: "item",
            addedDate: item.addedDate,
            quantity,
            description: "Increased quantities",
          });
        }
      }

      // If new quantity is less than or equal to 0, delete Item.
      if (item.quantity <= 0) {
        await deleteItemById(account_id, _id);
      } else {
        for (const socket_id in global.currentConnections[account_id]) {
          global.currentConnections[account_id][socket_id].socket.emit(
            "item_update",
            item
          );
        }
      }
      return item;
    } else {
      return result.ok;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes an item by _id. If successful, emits 'item_delete' to the
 * connected socket(s).
 * @param { string } _id
 * @returns { number } delete's result.
 */
async function deleteItemById(account_id, _id) {
  try {
    const result = await Inventory.findOneAndUpdate(
      { owner: account_id },
      { $pull: { items: { _id } } },
      { new: true, rawResult: true }
    );

    if (result.ok === 1) {
      await createActivity({
        owner: account_id,
        method: "removed",
        target: "item",
        addedDate: new Date(),
        quantity: 0,
        description: "Permanently removed",
      });

      for (const socket_id in global.currentConnections[account_id]) {
        global.currentConnections[account_id][socket_id].socket.emit(
          "item_delete",
          _id
        );
      }
    }
    return result.ok;
  } catch (error) {
    throw error;
  }
}

async function deleteInventoryByOwnerId(_id) {
  try {
    return await Inventory.deleteOne({ owner: _id });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  init,
  getItems,
  getItemById,
  getItemsAddedBetween,
  getItemsByNames,
  searchItemByName,
  createItem,
  updateItem,
  deleteItemById,
  deleteInventoryByOwnerId,
};
