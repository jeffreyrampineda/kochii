const Validator = require('validator');
const Item = require('../models/item');
const Group = require('../models/group');

/**
 * Validates all data required to create an item.
 * @param { JSON } data to be validated.
 * @return { JSON } object containing all errors.
 */
async function create(data) {
    const { name, quantity, addedDate, expirationDate, group } = data;
    let errors = {};

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
    } else if (!await Group.exists({ name: group })) {
        errors.group = "Group does not exist";
    }
    return errors;
}

/**
 * Validates all data required to update an item.
 * @param { JSON } data to be validated.
 * @return { JSON } object containing all errors.
 */
async function update(data) {
    const { _id, name, quantity, addedDate, expirationDate, group, option } = data;
    let errors = {};

    // _id validation
    if (!await Item.exists({ _id })) {
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
    } else if (!await Group.exists({ name: group })) {
        errors.group = "Group does not exist";
    }

    // Option validation
    if (!["inc", "set"].includes(option)) {
        errors.option = "Option is invalid";
    }
    return errors;
}

module.exports = {
    create,
    update
};
