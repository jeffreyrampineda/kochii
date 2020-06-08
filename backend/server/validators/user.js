const Validator = require('validator');
const User = require('../models/user');

/**
 * Sanitizes and validates all data required to login.
 * @param { JSON } body received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function login(body) {
    let { username = "", password = "" } = body;
    let errors = {};

    username = Validator.escape(username);
    password = Validator.escape(password);

    // Username validation
    if (Validator.isEmpty(username)) {
        errors.login = "Username is required";
    } else if (!Validator.isLength(username, { min: 6, max: 30 })) {
        errors.login = "Username must be between 6 to 30 characters";
    } else if (!/^[a-zA-Z0-9_-]*$/.test(username)) {
        errors.login = "Username must contain an alphanumeric, underscore (_), or dash (-)";
    } else if (!await User.exists({ username })) {
        errors.login = "Authentication failed";
    }

    // Password validation
    if (Validator.isEmpty(password)) {
        errors.login = "Password is required";
    } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
        errors.login = "Password must be between 6 to 30 characters";
    }
    return { errors, username, password };
}

/**
 * Sanitizes and validates all data required to register.
 * @param { JSON } body received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function register(body) {
    let { username = "", password = "", email = "" } = body;
    let errors = {};

    username = Validator.escape(username);
    password = Validator.escape(password);
    email = Validator.escape(email);

    // Username validation
    if (Validator.isEmpty(username)) {
        errors.usename = "Username is required";
    } else if (!Validator.isLength(username, { min: 6, max: 30 })) {
        errors.username = "Username must be between 6 to 30 characters";
    } else if (!/^[a-zA-Z0-9_-]*$/.test(username)) {
        errors.username = "Username must contain an alphanumeric, underscore (_), or dash (-)";
    } else if (await User.exists({ username })) {
        errors.username = "Username already exists";
    }

    // Password validation
    if (Validator.isEmpty(password)) {
        errors.password = "Password is required";
    } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
        errors.password = "Password must be between 6 to 30 characters";
    }

    // Email validation
    if (Validator.isEmpty(email)) {
        errors.email = "Email is required";
    } else if (!Validator.isEmail(email)) {
        errors.email = "Email is invalid";
    } else if (await User.exists({ email })) {
        errors.email = "Email already exists";
    }
    return { errors, username, password, email };
}

module.exports = {
    login,
    register
};
