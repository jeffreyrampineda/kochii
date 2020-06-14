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
 * Sanitizes and validates all data required to create an item.
 * @param { JSON } body received from the request.
 * @param { JSON } user object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function create(body, user) {
    let { name = "", quantity = 0, addedDate = "", expirationDate = "", group = "" } = body;
    let errors = {};

    name = Validator.escape(name);
    //quantity = Validator.escape(quantity);
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
    } else if (!await Inventory.exists({ owner: user._id, groups: group })) {
        errors.group = "Group does not exist";
    }
    return { errors, name, quantity, addedDate, expirationDate, group };
}

/**
 * Sanitizes and validates all data required to update an item.
 * @param { JSON } body received from the request.
 * @param { JSON } params received from the request.
 * @param { JSON } user object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function update(body, params, user) {
    let { _id = "", name = "", quantity = 0, addedDate = "", expirationDate = "", group = "" } = body;
    let { option = "" } = params;
    let errors = {};

    _id = Validator.escape(_id);
    name = Validator.escape(name);
    //quantity = Validator.escape(quantity);
    addedDate = Validator.escape(addedDate);
    expirationDate = Validator.escape(expirationDate);
    group = Validator.escape(group);
    option = Validator.escape(option);

    // _id validation
    if (!await Inventory.exists({ owner: user._id, "items._id": _id })) {
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
    } else if (!await Inventory.exists({ owner: user._id, groups: group })) {
        errors.group = "Group does not exist";
    }

    // Option validation
    if (!["inc", "set"].includes(option)) {
        errors.option = "Option is invalid";
    }
    return { errors, _id, name, quantity, addedDate, expirationDate, group, option };
}

/**
 * Sanitizes and validates all data required to delete an item.
 * @param { JSON } params received from the request.
 * @param { JSON } user object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function del(params, user) {
    let { _id = "" } = params;
    let errors = {};

    _id = Validator.escape(_id);

    // _id validation
    if (Validator.isEmpty(_id)) {
        errors._id = "Id is required";
    } else if (!await Inventory.exists({ owner: user._id, "items._id": _id })) {
        errors._id = "Id does not exist";
    }
    return { errors, _id };
}

module.exports = {
    searchByName,
    create,
    update,
    del,
};
