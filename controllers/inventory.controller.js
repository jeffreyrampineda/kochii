const InventoryService = require("../services/inventory.service");
const Validate = require("../validators/item");
const searchRawFood = require("../services/external_api.service").searchRawFood;
const createError = require("http-errors");

/**
 * Get all items from the database.
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
exports.item_list = async function (req, res, next) {
  try {
    const items = await InventoryService.getItems(req.user);
    res.status(200).json(items);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Get all items starting with the specified pattern from the database.
 * @requires { params } name
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
exports.item_list_search = async function (req, res, next) {
  try {
    const { name } = await Validate.searchByName(req.params);

    const item = await InventoryService.searchItemByName(req.user, name);
    res.status(200).json(item);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

exports.item_list_between_dates = async function (req, res, next) {
  try {
    const { startDate, endDate } = Validate.getAddedBetween(req.query);

    const items = await InventoryService.getItemsAddedBetween(
      req.user,
      startDate,
      endDate
    );
    res.status(200).json(items);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Get all items within the specified names list from the database.
 * @requires { query } names
 * @response { JSON, error? } array of item objects if successful otherwise, an error.
 */
exports.item_list_names = async function (req, res, next) {
  try {
    const { refined } = await Validate.getByNames(req.query);

    const items = InventoryService.getItemsByNames(req.user, refined);
    res.status(200).json(items);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

exports.item_nutrition = async function (req, res, next) {
  try {
    const { query } = req.query;

    const result = await searchRawFood(query);
    res.status(200).json(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Get item from the database by _id.
 * @response { JSON, error? } Item objects if successful otherwise, an error.
 */
exports.item_detail = async function (req, res, next) {
  try {
    const { _id } = req.params;

    const item = await InventoryService.getItemById(req.user, _id);
    res.status(200).json(item);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Creates a new item.
 * @requires { body } name, quantity, cost, addedDate, expirationDate, group
 * @response { JSON, error? } new item if successful otherwise, an error.
 */
exports.item_create = async function (req, res, next) {
  try {
    const { name, quantity, cost, addedDate, expirationDate, group } =
      await Validate.create(req.body, req.user);

    const item = await InventoryService.createItem(
      req.user,
      name,
      quantity,
      cost,
      addedDate,
      expirationDate,
      group
    );
    res.status(200).json(item);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Updates an existing item. If the updated item's quantity is less than or
 * equal to 0, delete the item.
 * @requires { body, params } _id, name, quantity, cost, addedDate, expirationDate, group, option
 * @response { JSON, error? } updated item if successful otherwise, an error.
 */
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

    const item = await InventoryService.updateItem(
      req.user,
      _id,
      name,
      quantity,
      cost,
      addedDate,
      expirationDate,
      group,
      option
    );
    res.status(200).json(item);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Deletes an item by _id using the deleteItemById(account_id, item_id) function.
 * @requires { params } _id
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
exports.item_delete = async function (req, res, next) {
  try {
    const { _id } = Validate.del(req.params, req.user);

    const result = { ok: await InventoryService.deleteItemById(req.user, _id) };
    res.status(200).json(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};
