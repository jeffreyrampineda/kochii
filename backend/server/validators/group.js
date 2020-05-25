const Validator = require('validator');

/**
 * Validates all data required to create a group.
 * @param { JSON } data to be validated.
 * @return { JSON } object containing all errors.
 */
function create(data) {
    const { name } = data;
    let errors = {};

    // Name validation
    if (Validator.isEmpty(name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(name, { min: 1, max: 30 })) {
        errors.name = "Name must be between 1 to 30 characters";
    }
    return errors;
}

module.exports = {
    create
};
