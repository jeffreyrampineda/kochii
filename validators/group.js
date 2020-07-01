const Validator = require('validator');
const Inventory = require('../models/inventory');

/**
 * Sanitizes and validates all data required to create a group.
 * @param { JSON } params received from the request.
 * @param { JSON } user object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function create(params, user) {
    let { name = "" } = params;
    let errors = {};

    name = Validator.escape(name);

    // Name validation
    if (Validator.isEmpty(name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(name, { min: 1, max: 30 })) {
        errors.name = "Name must be between 1 to 30 characters";
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        errors.name = "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)";
    } else if (await Inventory.exists({ owner: user._id, groups: name })) {
        errors.name = "Name already exists";
    }
    return { errors, name };
}

/**
 * Sanitizes and validates all data required to delete a group.
 * @param { JSON } params received from the request.
 * @param { JSON } user object used to identify the owner.
 * @return { JSON } object containing all errors and data.
 */
async function del(params, user) {
    let { name = "" } = params;
    let errors = {};

    name = Validator.escape(name);

    // Name validation
    if (Validator.isEmpty(name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(name, { min: 1, max: 30 })) {
        errors.name = "Name must be between 1 to 30 characters";
    } else if (!/^[a-zA-Z0-9 _-]*$/.test(name)) {
        errors.name = "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)";
    } else if (!await Inventory.exists({ owner: user._id, groups: name })) {
        errors.name = "Name does not exists";
    }
    return { errors, name };
}

module.exports = {
    create,
    del,
};
