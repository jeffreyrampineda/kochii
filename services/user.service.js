const User = require('../models/user');
const mongoose = require('mongoose');
const initInventory = require('./inventory.service').init;
const initHistory = require('./history.service').init;
const cryptoRandomString = require('crypto-random-string');
const sendVerificationEmail = require('./email.service').sendVerificationEmail;

async function init(username, password, email) {
    try {
        const verificationToken = cryptoRandomString({ length: 16, type: 'url-safe' });
        const history_id = mongoose.Types.ObjectId();
        const inventory_id = mongoose.Types.ObjectId();

        const user = await User.create({
            username,
            password,
            email,
            isVerified: false,
            verificationToken,
            inventory: inventory_id,
            history: history_id
        });

        const initHistoryResult = await initHistory(user, history_id);
        const initInventoryResult = await initInventory(user, inventory_id);

        if (initHistoryResult && initInventoryResult) {
            console.log("User successfully created");
        }

        sendVerificationEmail(email, verificationToken);

        return user;
    } catch (error) {
        throw (error);
    }
}

async function verify(user, email) {
    try {
        await User.findOneAndUpdate(
            { _id: user._id, email },
            { isVerified: true },
            { runValidators: true }
        );

        return true;
    } catch (error) {
        throw (error);
    }
}

async function getUserByName(username) {
    try {
        return await User.findOne({ username });
    } catch (error) {
        throw (error);
    }
}

async function getUserByEmail(email) {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    init,
    verify,
    getUserByName,
    getUserByEmail,
}