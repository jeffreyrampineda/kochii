const Validator = require('validator');
const Inventory = require('../models/inventory');

/**
 * Sanitizes and validates all data required to create a group. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } params received from the request.
 * @param { JSON } account_id object used to identify the owner.
 * @return { JSON } object containing all sanitized data.
 */
async function create(params, account_id) {
    let { name = "" } = params;
    let error_messages = [];

    name = Validator.escape(name);

    // Name validation
    if (Validator.isEmpty(name)) {
        error_messages.push("Name is required");
    } else if (!Validator.isLength(name, { min: 1, max: 30 })) {
        error_messages.push("Name must be between 1 to 30 characters");
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        error_messages.push("Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)");
    } else if (await Inventory.exists({ owner: account_id, groups: name })) {
        error_messages.push("Name already exists");
    }

    if (error_messages.length > 0) {
        throw { status: 400, error_messages: error_messages };
    }
    return { name };
}

/**
 * Sanitizes and validates all data required to delete a group. Throws
 * an HTTP error status 400 if invalid.
 * @param { JSON } params received from the request.
 * @param { JSON } account_id object used to identify the owner.
 * @return { JSON } object containing all santizied data.
 */
async function del(params, account_id) {
    let { name = "" } = params;
    let error_messages = [];

    name = Validator.escape(name);

    // Name validation
    if (Validator.isEmpty(name)) {
        error_messages.push("Name is required");
    } else if (!Validator.isLength(name, { min: 1, max: 30 })) {
        error_messages.push("Name must be between 1 to 30 characters");
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        error_messages.push("Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)");
    } else if (!await Inventory.exists({ owner: account_id, groups: name })) {
        error_messages.push("Name does not exists");
    }

    if (error_messages.length > 0) {
        throw { status: 400, error_messages: error_messages };
    }
    return { name };
}

module.exports = {
    create,
    del,
};
