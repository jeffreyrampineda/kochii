const User = require('../models/user');
const Helper = require('../util/helpers');
const Validate = require('../validators/user');

/**
 * Authenticates the user to the database.
 * @requires { body } username, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
async function login(ctx) {
    try {
        const { username = "", password = "" } = ctx.request.body;
        const errors = await Validate.login({ username, password });

        if (Object.keys(errors).length) {
            ctx.throw(401, JSON.stringify(errors));
        }

        const user = await User.findOne({ username });

        // User should exist and should have matching passwords.
        if (user && user.comparePasswords(password)) {

            // 202 - Accepted.
            ctx.status = 202;
            ctx.body = { token: Helper.generateToken(user.toJSON()) };
        } else {
            ctx.throw(401, JSON.stringify({ login: "Authentication failed" }));
        }
    } catch (error) {
        ctx.throw(401, error);
    }
}

/**
 * Registers the user to the database.
 * @requires { body } username, password, email
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
async function register(ctx) {
    try {
        const { username = "", password = "", email = "" } = ctx.request.body;
        const errors = await Validate.register({ username, password, email });

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const user = await User.create({ username, password, email });

        // 202 - Accepted
        ctx.status = 202;
        ctx.body = { token: Helper.generateToken(user.toJSON()) };
    } catch (error) {
        ctx.throw(400, error);
    }
}

module.exports = {
    login,
    register
};
