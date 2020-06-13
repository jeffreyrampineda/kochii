const mongoose = require('mongoose');
const User = require('../models/user');
const Inventory = require('../models/inventory');
const History = require('../models/history');
const Helper = require('../util/helpers');
const Validate = require('../validators/user');
const cryptoRandomString = require('crypto-random-string');
const { sendVerificationEmail } = require('../util/email');

/**
 * Authenticates the user to the database.
 * @requires { body } username, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
async function login(ctx) {
    try {
        const { errors, username, password } = await Validate.login(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(401, JSON.stringify(errors));
        }

        const user = await User.findOne({ username });

        // User should exist and should have matching passwords.
        if (user && user.comparePasswords(password)) {

            // 202 - Accepted.
            ctx.status = 202;
            ctx.body = {
                token: Helper.generateToken(user.toJSON()),
                isVerified: user.isVerified,
            };
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
        const { errors, username, password, email } = await Validate.register(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const inventory_id = mongoose.Types.ObjectId();
        const history_id = mongoose.Types.ObjectId();
        const verificationToken = cryptoRandomString({ length: 16, type: 'url-safe' });

        const user = await User.create({
            username,
            password,
            email,
            isVerified: false,
            verificationToken,
            inventory: inventory_id,
            history: history_id
        });

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
                method: "create",
                target: "user",
                quantity: 0,
                addedDate: new Date(),
                description: "Account registered",
            }]
        });

        sendVerificationEmail(email, verificationToken);

        // 202 - Accepted
        ctx.status = 202;
        ctx.body = {
            token: Helper.generateToken(user.toJSON()),
            isVerified: user.isVerified,
        };
    } catch (error) {
        ctx.throw(400, error);
    }
}

/**
 * Verifies the token and email.
 * @requires { query } token, email
 * @response { JSON, error? } the result.
 */
async function verify(ctx) {
    try {
        const { errors, token, email } = await Validate.verify(ctx.request.query);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const user = await User.findOne({ email });
        let response = "";

        if (user && user.isVerified) {
            response = "User is already verified";
        } else if (user && user.compareTokens(token)) {
            await User.findOneAndUpdate(
                { _id: user._id, email },
                { isVerified: true },
                { runValidators: true }
            );
            response = "User has been verified"
        } else {
            response = "Token is expired";
        }

        ctx.status = 202;
        ctx.body = response;
    } catch (error) {
        ctx.throw(401, error);
    }
}

module.exports = {
    login,
    register,
    verify,
};
