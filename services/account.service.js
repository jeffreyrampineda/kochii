const Account = require('../models/account');
const mongoose = require('mongoose');
const initInventory = require('./inventory.service').init;
const delInventory = require('./inventory.service').deleteInventoryByOwnerId;
const initActivity = require('./activity.service').init;
const delActivity = require('./activity.service').deleteActivitiesByOwnerId;
const cryptoRandomString = require('crypto-random-string');
const sendVerificationEmail = require('./external_api.service').sendVerificationEmail;

async function init(accountName, password, email, firstName, lastName) {
    try {
        const verificationToken = cryptoRandomString({ length: 16, type: 'url-safe' });
        const activity_id = mongoose.Types.ObjectId();
        const inventory_id = mongoose.Types.ObjectId();

        const account = await Account.create({
            accountName,
            password,
            email,
            firstName,
            lastName,
            isVerified: false,
            verificationToken,
            inventory: inventory_id,
            activity: activity_id
        });

        const initActivityResult = await initActivity(account._id, activity_id);
        const initInventoryResult = await initInventory(account._id, inventory_id);

        if (initActivityResult && initInventoryResult) {
            console.log("Account successfully created");
        }

        sendVerificationEmail(email, verificationToken);

        return account;
    } catch (error) {
        throw (error);
    }
}

async function updateAccount(account_id, firstName, lastName) {
    try {
        const result = await Account.findOneAndUpdate(
            { _id: account_id },
            { firstName, lastName },
            { new: true, runValidators: true }
        ).select('-_id firstName lastName');
        return result;

    } catch (error) {
        throw (error);
    }
}

async function verify(token, email) {
    try {
        const result = await Account.findOneAndUpdate(
            { email: email, verificationToken: token },
            { isVerified: true },
            { runValidators: true, rawResult: true }
        );
        return result.lastErrorObject.n === 1 ? true : false;
        
    } catch (error) {
        throw (error);
    }
}

async function getAccountByName(accountName) {
    try {
        return await Account.findOne({ accountName });
    } catch (error) {
        throw (error);
    }
}

async function getAccountByEmail(email) {
    try {
        return await Account.findOne({ email });
    } catch (error) {
        throw (error);
    }
}

async function deleteAccountById(account_id) {
    try {
        let result = {
            ok: 0
        }
        const activityResult = await delActivity(account_id);
        const inventoryResult = await delInventory(account_id);
        
        if (activityResult.ok && inventoryResult.ok) {
            result = await Account.deleteOne({ _id: account_id });
        }
        return result;
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    init,
    verify,
    getAccountByName,
    getAccountByEmail,
    deleteAccountById,
    updateAccount,
}