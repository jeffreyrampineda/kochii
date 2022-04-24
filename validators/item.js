const Validator = require("validator");
const Inventory = require("../models/inventory");

/**
 * Sanitizes and validates all data required to search an item by name. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } params received from the request.
 * @return { JSON } object containing all sanitized data.
 */
async function searchByName(params) {
  let { name = "" } = params;
  let error_messages = [];

  name = Validator.escape(name);

  if (name.length > 30) {
    name = name.slice(0, 30);
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { errors, name };
}

/**
 * Sanitizes and validates all data required to get items by name. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } query received from the request.
 * @return { JSON } object containing all sanitized data.
 */
async function getByNames(query) {
  let { names = "" } = query;
  let refined = [];
  let error_messages = [];

  names = Validator.escape(name);

  refined = names.split(",");

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { refined };
}

/**
 * Sanitizes and validates all data required to create an item. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } body received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all sanitized data.
 */
async function create(body, account_id) {
  let {
    name = "",
    quantity = 0,
    cost = 0,
    addedDate = "",
    expirationDate = "",
    group = "",
  } = body;
  let error_messages = [];

  name = Validator.escape(name);
  addedDate = Validator.escape(addedDate);
  expirationDate = Validator.escape(expirationDate);
  group = Validator.escape(group);

  // Name validation
  if (Validator.isEmpty(name)) {
    error_messages.push("Name is required");
  } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
    error_messages.push("Name must be between 2 to 30 characters");
  } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
    error_messages.push(
      "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)"
    );
  }

  // Quantity validation
  if (quantity === undefined) {
    error_messages.push("Quantity is required");
  } else if (isNaN(quantity)) {
    error_messages.push("Quantity must be a number");
  } else if (quantity < 1 || quantity > 999) {
    error_messages.push("Quantity must be between 1 and 999");
  }

  // Cost validation
  if (cost === undefined) {
    error_messages.push("Cost is required");
  } else if (isNaN(cost)) {
    error_messages.push("Cost must be a number");
  } else if (cost < 0 || cost > 999) {
    error_messages.push("Cost must be between 0 and 999");
  }

  // AddedDate validation
  if (Validator.toDate(addedDate) === null) {
    error_messages.push("Added date is invalid");
  }

  // ExpirationDate validation
  if (Validator.toDate(expirationDate) === null) {
    error_messages.push("Expiration date is invalid");
  }

  // Group validation
  if (group === "") {
    error_messages.push("Group cannot be an empty string");
  } else if (!(await Inventory.exists({ owner: account_id, groups: group }))) {
    error_messages.push("Group does not exist");
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { name, quantity, cost, addedDate, expirationDate, group };
}

/**
 * Sanitizes and validates all data required to update an item. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } body received from the request.
 * @param { JSON } params received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all sanitized data.
 */
async function update(body, params, account_id) {
  let {
    _id = "",
    name = "",
    quantity = 0,
    cost = 0,
    addedDate = "",
    expirationDate = "",
    group = "",
  } = body;
  let { option = "" } = params;
  let error_messages = [];

  _id = Validator.escape(_id);
  name = Validator.escape(name);
  addedDate = Validator.escape(addedDate);
  expirationDate = Validator.escape(expirationDate);
  group = Validator.escape(group);
  option = Validator.escape(option);

  // _id validation
  if (!(await Inventory.exists({ owner: account_id, "items._id": _id }))) {
    error_messages.push("Id does not exist");
  }

  // Name validation
  if (Validator.isEmpty(name)) {
    error_messages.push("Name is required");
  } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
    error_messages.push("Name must be between 2 to 30 characters");
  } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
    error_messages.push(
      "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)"
    );
  }

  // Quantity validation
  if (quantity === undefined) {
    error_messages.push("Quantity is required");
  } else if (isNaN(quantity)) {
    error_messages.push("Quantity must be a number");
  } else if (quantity === 0) {
    error_messages.push("Quantity cannot be 0");
  } else if (option === "set" && (quantity < 1 || quantity > 999)) {
    error_messages.push("Quantity must be between 1 and 999");
  }

  // Cost validation
  if (cost === undefined) {
    error_messages.push("Cost is required");
  } else if (isNaN(cost)) {
    error_messages.push("Cost must be a number");
  } else if (cost < 0 || cost > 999) {
    error_messages.push("Cost must be between 0 and 999");
  }

  // AddedDate validation
  if (Validator.toDate(addedDate) === null) {
    error_messages.push("Added date is invalid");
  }

  // ExpirationDate validation
  if (Validator.toDate(expirationDate) === null) {
    error_messages.push("Expiration date is invalid");
  }

  // Group validation
  if (group === "") {
    error_messages.push("Group cannot be an empty string");
  } else if (!Validator.isLength(group, { min: 1, max: 30 })) {
    error_messages.push("Group must be between 1 to 30 characters");
  } else if (!/^[a-zA-Z0-9 _-]*$/.test(group)) {
    error_messages.push(
      "Group must contain an alphanumeric, space ( ), underscore (_), or dash (-)"
    );
  } else if (!(await Inventory.exists({ owner: account_id, groups: group }))) {
    error_messages.push("Group does not exist");
  }

  // Option validation
  if (!["inc", "set"].includes(option)) {
    error_messages.push("Option is invalid");
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return {
    _id,
    name,
    quantity,
    cost,
    addedDate,
    expirationDate,
    group,
    option,
  };
}

/**
 * Sanitizes and validates all data required to delete an item. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } params received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all sanitized data.
 */
async function del(params, account_id) {
  let { _id = "" } = params;
  let error_messages = [];

  _id = Validator.escape(_id);

  // _id validation
  if (Validator.isEmpty(_id)) {
    error_messages.push("Id is required");
  } else if (
    !(await Inventory.exists({ owner: account_id, "items._id": _id }))
  ) {
    error_messages.push("Id does not exist");
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { _id };
}

/**
 * Sanitizes and validates all data required to delete an item. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } query received from the request.
 * @return { JSON } object containing all sanitized data.
 */
function getAddedBetween(query) {
  let { startDate = "", endDate = "" } = query;
  let error_messages = [];

  // startDate validation
  if (Validator.toDate(startDate) === null) {
    error_messages.push("Start date is invalid");
  }

  // endDate validation
  if (Validator.toDate(endDate) === null) {
    error_messages.push("End date is invalid");
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { startDate, endDate };
}

module.exports = {
  searchByName,
  getByNames,
  create,
  update,
  del,
  getAddedBetween,
};
