const mongoose = require('mongoose');
const User = require('../models/user');
const Inventory = require('../models/inventory');
const History = require('../models/history');
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

        const inventory_id = mongoose.Types.ObjectId();
        const history_id = mongoose.Types.ObjectId();

        const user = await User.create({ username, password, email, inventory: inventory_id, history: history_id });
        const inventory = await Inventory.create({
            _id: inventory_id,
            owner: user._id,
            groups: ["Default"],
            items: [{
                name: "Sample",
                quantity: 1,
            }]
        });
        const history = await History.create({
            _id: history_id,
            owner: user._id,
            history: [{
                method: "registered",
                target: "user",
                quantity: 0,
                addedDate: new Date(),
                description: "Account created",
            }]
        });

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
