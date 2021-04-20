const Validator = require('validator');
const Inventory = require('../models/inventory');

/**
 * Sanitizes and validates all data required to search an item by name.
 * @param { JSON } params received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function searchByName(params) {
    let { name = "" } = params;
    let errors = {};

    name = Validator.escape(name);

    if (name.length > 30) {
        name = name.slice(0, 30);
    } 
    return { errors, name };
}

/**
 * Sanitizes and validates all data required to get items by name.
 * @param { JSON } query received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function getByNames(query) {
    let { names = "" } = query;
    let refined = [];
    let errors = {};

    names = Validator.escape(name);

    refined = names.split(',');
    return { errors, refined };
}

/**
 * Sanitizes and validates all data required to create an item.
 * @param { JSON } body received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function create(body, account_id) {
    let { name = "", quantity = 0, cost = 0, addedDate = "", expirationDate = "", group = "" } = body;
    let errors = {};

    name = Validator.escape(name);
    addedDate = Validator.escape(addedDate);
    expirationDate = Validator.escape(expirationDate);
    group = Validator.escape(group);

    // Name validation
    if (Validator.isEmpty(name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        errors.name = "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)";
    }

    // Quantity validation
    if (quantity === undefined) {
        errors.quantity = "Quantity is required";
    } else if (isNaN(quantity)) {
        errors.quantity = "Quantity must be a number";
    } else if (quantity < 1 || quantity > 999) {
        errors.quantity = "Quantity must be between 1 and 999";
    }

    // Cost validation
    if (cost === undefined) {
        errors.cost = "Cost is required";
    } else if (isNaN(cost)) {
        errors.cost = "Cost must be a number";
    } else if (cost < 0 || cost > 999) {
        errors.cost = "Cost must be between 0 and 999";
    }

    // AddedDate validation
    if (Validator.toDate(addedDate) === null) {
        errors.addedDate = "Added date is invalid";
    }

    // ExpirationDate validation
    if (Validator.toDate(expirationDate) === null) {
        errors.expirationDate = "Expiration date is invalid";
    }

    // Group validation
    if (group === "") {
        errors.group = "Group cannot be an empty string";
    } else if (!await Inventory.exists({ owner: account_id, groups: group })) {
        errors.group = "Group does not exist";
    }
    return { errors, name, quantity, cost, addedDate, expirationDate, group };
}

/**
 * Sanitizes and validates all data required to update an item.
 * @param { JSON } body received from the request.
 * @param { JSON } params received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function update(body, params, account_id) {
    let { _id = "", name = "", quantity = 0, cost = 0, addedDate = "", expirationDate = "", group = "" } = body;
    let { option = "" } = params;
    let errors = {};

    _id = Validator.escape(_id);
    name = Validator.escape(name);
    addedDate = Validator.escape(addedDate);
    expirationDate = Validator.escape(expirationDate);
    group = Validator.escape(group);
    option = Validator.escape(option);

    // _id validation
    if (!await Inventory.exists({ owner: account_id, "items._id": _id })) {
        errors._id = "Id does not exist";
    }

    // Name validation
    if (Validator.isEmpty(name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        errors.name = "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)";
    }

    // Quantity validation
    if (quantity === undefined) {
        errors.quantity = "Quantity is required";
    } else if (isNaN(quantity)) {
        errors.quantity = "Quantity must be a number";
    } else if (quantity === 0) {
        errors.quantity = "Quantity cannot be 0";
    } else if (option === 'set' && (quantity < 1 || quantity > 999)) {
        errors.quantity = "Quantity must be between 1 and 999";
    }

    // Cost validation
    if (cost === undefined) {
        errors.cost = "Cost is required";
    } else if (isNaN(cost)) {
        errors.cost = "Cost must be a number";
    } else if (cost < 0 || cost > 999) {
        errors.cost = "Cost must be between 0 and 999";
    }

    // AddedDate validation
    if (Validator.toDate(addedDate) === null) {
        errors.addedDate = "Added date is invalid";
    }

    // ExpirationDate validation
    if (Validator.toDate(expirationDate) === null) {
        errors.expirationDate = "Expiration date is invalid";
    }

    // Group validation
    if (group === "") {
        errors.group = "Group cannot be an empty string";
    } else if (!Validator.isLength(group, { min: 1, max: 30 })) {
        errors.group = "Group must be between 1 to 30 characters";
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(group)) {
        errors.group = "Group must contain an alphanumeric, space ( ), underscore (_), or dash (-)";
    } else if (!await Inventory.exists({ owner: account_id, groups: group })) {
        errors.group = "Group does not exist";
    }

    // Option validation
    if (!["inc", "set"].includes(option)) {
        errors.option = "Option is invalid";
    }
    return { errors, _id, name, quantity, cost, addedDate, expirationDate, group, option };
}

/**
 * Sanitizes and validates all data required to delete an item.
 * @param { JSON } params received from the request.
 * @param { string } account_id object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function del(params, account_id) {
    let { _id = "" } = params;
    let errors = {};

    _id = Validator.escape(_id);

    // _id validation
    if (Validator.isEmpty(_id)) {
        errors._id = "Id is required";
    } else if (!await Inventory.exists({ owner: account_id, "items._id": _id })) {
        errors._id = "Id does not exist";
    }
    return { errors, _id };
}

function getAddedBetween(query) { 
    let { startDate = "", endDate = "" } = query;
    let errors = {};

    // startDate validation
    if (Validator.toDate(startDate) === null) {
        errors.startDate = "Start date is invalid";
    }

    // endDate validation
    if (Validator.toDate(endDate) === null) {
        errors.endDate = "End date is invalid";
    }

    return { errors, startDate, endDate };
}

module.exports = {
    searchByName,
    getByNames,
    create,
    update,
    del,
    getAddedBetween,
};
