const debug = require('debug')('kochii:server-activity.controller');
const Account = require('../models/account');
const mongoose = require('mongoose');
const inventoryController = require('../controllers/inventory.controller');
const activityController = require('../controllers/activity.controller');
// const cryptoRandomString = require('crypto-random-string');
const sendVerificationEmail =
  require('../util/external_api.service').sendVerificationEmail;
const Validate = require('../validators/account');
const jwt = require('jsonwebtoken');

// Creates a new account.
exports.account_create = async function (req, res, next) {
  try {
    const { username, password, email, firstName, lastName } =
      await Validate.signup(req.body);

    // TODO: cryptoRandomString(...);
    // const verificationToken = cryptoRandomString({
    //    length: 16,
    //    type: "url-safe",
    // });
    const verificationToken = 'temp';
    const activityId = new mongoose.Types.ObjectId();
    const inventoryId = new mongoose.Types.ObjectId();

    const account = await Account.create({
      username,
      password,
      email,
      firstName,
      lastName,
      isVerified: false,
      verificationToken,
      inventory: inventoryId,
      activity: activityId,
    });

    const initActivityResult = await activityController.init(
      account._id,
      activityId,
    );
    const initInventoryResult = await inventoryController.init(
      account._id,
      inventoryId,
    );

    if (initActivityResult && initInventoryResult) {
      console.log('Account successfully created');
    }

    sendVerificationEmail(email, verificationToken);

    // 202 - Accepted
    res.status(202).json({
      username,
      email,
      firstName,
      lastName,
      token: generateToken(account._id),
      isVerified: account.isVerified,
    });
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Authenticates the Account.
exports.account_login = async function (req, res, next) {
  try {
    const { username, password } = await Validate.login(req.body);

    const account = await Account.findOne({ username });

    // Account should exist and should have matching passwords.
    if (account && account.comparePasswords(password)) {
      // 202 - Accepted.
      res.status(202).json({
        username: account.username,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        token: generateToken(account._id),
        isVerified: account.isVerified,
      });
    } else {
      throw { status: 401, error_messages: ['Authentication failed'] };
    }
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Verifies the token and email.
exports.account_verify = async function (req, res, next) {
  try {
    const { token, email } = await Validate.verify(req.query);

    let response = 'loading...';

    const result = await Account.findOneAndUpdate(
      { email: email, verificationToken: token },
      { isVerified: true },
      { runValidators: true, rawResult: true },
    );

    response =
      result.lastErrorObject.n === 1
        ? 'Account has been verified'
        : 'Verification failed.';

    res.status(202).send(response);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Updates the account.
exports.account_update = async function (req, res, next) {
  try {
    const { firstName, lastName } = await Validate.update(req.body);

    const result = await Account.findOneAndUpdate(
      { _id: req.user },
      { firstName, lastName },
      { new: true, runValidators: true },
    ).select('-_id firstName lastName');

    res.status(200).json(result);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

// Delete the account.
exports.account_delete = async function (req, res, next) {
  try {
    let result = {
      deletedCount: 0,
    };
    const activityResult = await activityController.deleteActivitiesByOwnerId(
      req.user,
    );
    const inventoryResult = await inventoryController.deleteInventoryByOwnerId(
      req.user,
    );
    if (activityResult.deletedCount && inventoryResult.deletedCount) {
      result = await Account.deleteOne({ _id: req.user });
    }

    res.status(200).json(result.deletedCount);
  } catch (error) {
    debug('Error');

    next(error);
  }
};

/**
 * Generates a JSON Web Token from the provided information.
 * @param {string} accountId The provided information.
 * @return {object} The JSON Web Token string.
 */
function generateToken(accountId) {
  const payload = {
    _id: accountId,
  };
  return jwt.sign(payload, process.env.SECRET_KEY);
}
