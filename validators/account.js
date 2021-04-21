const Validator = require('validator');
const Account = require('../models/account');

/**
 * Sanitizes and validates all data required to login.
 * @param { JSON } body received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function login(body) {
    let { accountName = "", password = "" } = body;
    let errors = {};

    accountName = Validator.escape(accountName);
    password = Validator.escape(password);

    // accountName validation
    if (Validator.isEmpty(accountName)) {
        errors.login = "Account name is required";
    } else if (!Validator.isLength(accountName, { min: 6, max: 30 })) {
        errors.login = "Account name must be between 6 to 30 characters";
    } else if (!/^[a-zA-Z0-9_-]*$/.test(accountName)) {
        errors.login = "Account name must contain an alphanumeric, underscore (_), or dash (-)";
    } else if (!await Account.exists({ accountName })) {
        errors.login = "Authentication failed";
    }

    // Password validation
    if (Validator.isEmpty(password)) {
        errors.login = "Password is required";
    } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
        errors.login = "Password must be between 6 to 30 characters";
    }
    return { errors, accountName, password };
}

/**
 * Sanitizes and validates all data required to register.
 * @param { JSON } body received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function register(body) {
    let { accountName = "", password = "", email = "", firstName = "", lastName = "" } = body;
    let errors = {};

    accountName = Validator.escape(accountName);
    password = Validator.escape(password);
    email = Validator.escape(email);
    firstName = Validator.escape(firstName);
    lastName = Validator.escape(lastName);

    // accountName validation
    if (Validator.isEmpty(accountName)) {
        errors.usename = "Account name is required";
    } else if (!Validator.isLength(accountName, { min: 6, max: 30 })) {
        errors.accountName = "Account name must be between 6 to 30 characters";
    } else if (!/^[a-zA-Z0-9_-]*$/.test(accountName)) {
        errors.accountName = "Account name must contain an alphanumeric, underscore (_), or dash (-)";
    } else if (await Account.exists({ accountName })) {
        errors.accountName = "Account name already exists";
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
    } else if (await Account.exists({ email })) {
        errors.email = "Email already exists";
    }

    // firstName validation
    if (Validator.isEmpty(firstName)) {
        errors.firstName = "First name is required";
    } else if (!Validator.isLength(firstName, { min: 2, max: 30 })) {
        errors.firstName = "First name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
        errors.firstName = "First name must only contain letters";
    }

    // lastName validation
    if (Validator.isEmpty(lastName)) {
        errors.lastName = "Last name is required";
    } else if (!Validator.isLength(lastName, { min: 2, max: 30 })) {
        errors.lastName = "Last name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
        errors.lastName = "Last name must only contain letters";
    }
    return { errors, accountName, password, email, firstName, lastName };
}

/**
 * Sanitizes and validates all data required to update.
 * @param { JSON } body received from the request.
 * @return { JSON } object containing all errors and data.
 */
 async function update(body) {
    let { firstName = "", lastName = "" } = body;
    let errors = {};

    firstName = Validator.escape(firstName);
    lastName = Validator.escape(lastName);

    // firstName validation
    if (Validator.isEmpty(firstName)) {
        errors.firstName = "First name is required";
    } else if (!Validator.isLength(firstName, { min: 2, max: 30 })) {
        errors.firstName = "First name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
        errors.firstName = "First name must only contain letters";
    }

    // lastName validation
    if (Validator.isEmpty(lastName)) {
        errors.lastName = "Last name is required";
    } else if (!Validator.isLength(lastName, { min: 2, max: 30 })) {
        errors.lastName = "Last name must be between 2 to 30 characters";
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
        errors.lastName = "Last name must only contain letters";
    }
    return { errors, firstName, lastName };
}

/**
 * Sanitizes and validates all data required to verify an email.
 * @param { JSON } query received from the request.
 * @return { JSON } object containing all errors and data.
 */
async function verify(query) {
    let { token = "", email = "" } = query;
    let errors = {};

    token = Validator.escape(token);
    email = Validator.escape(email);

    // Token validation
    if (Validator.isEmpty(token)) {
        errors.token = "Token is required";
    } else if (!Validator.isLength(token, { min: 16, max: 16 })) {
        errors.token = "Token is invalid";
    }

    // Email validation
    if (Validator.isEmpty(email)) {
        errors.email = "Email is required";
    } else if (!Validator.isEmail(email)) {
        errors.email = "Email is invalid";
    }
    return { errors, token, email };
}

module.exports = {
    login,
    register,
    verify,
    update,
};
