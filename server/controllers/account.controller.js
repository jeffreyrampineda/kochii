const Account = require("../models/account");
const mongoose = require("mongoose");
const inventory_controller = require("../controllers/inventory.controller");
const activity_controller = require("../controllers/activity.controller");
const cryptoRandomString = require("crypto-random-string");
const sendVerificationEmail =
  require("../util/external_api.service").sendVerificationEmail;
const Validate = require("../validators/account");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

/**
 * Registers the account to the database.
 * @requires { body } username, password, email, firstName, lastName
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
exports.account_create = async function (req, res, next) {
  try {
    const { username, password, email, firstName, lastName } =
      await Validate.register(req.body);

    const verificationToken = cryptoRandomString({
      length: 16,
      type: "url-safe",
    });
    const activity_id = mongoose.Types.ObjectId();
    const inventory_id = mongoose.Types.ObjectId();

    const account = await Account.create({
      username,
      password,
      email,
      firstName,
      lastName,
      isVerified: false,
      verificationToken,
      inventory: inventory_id,
      activity: activity_id,
    });

    const initActivityResult = await activity_controller.init(
      account._id,
      activity_id
    );
    const initInventoryResult = await inventory_controller.init(
      account._id,
      inventory_id
    );

    if (initActivityResult && initInventoryResult) {
      console.log("Account successfully created");
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
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Authenticates the Account to the database.
 * @requires { body } username, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
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
      throw { status: 401, error_messages: ["Authentication failed"] };
    }
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Verifies the token and email.
 * @requires { query } token, email
 * @response { JSON, error? } the result.
 */
exports.account_verify = async function (req, res, next) {
  try {
    const { token, email } = await Validate.verify(req.query);

    let response = "loading...";

    const result = await Account.findOneAndUpdate(
      { email: email, verificationToken: token },
      { isVerified: true },
      { runValidators: true, rawResult: true }
    );

    response =
      result.lastErrorObject.n === 1
        ? "Account has been verified"
        : "Verification failed.";

    res.status(202).send(response);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Updates the current account.
 * @response { JSON, error? } updated account if successful otherwise, an error.
 */
exports.account_update = async function (req, res, next) {
  try {
    const { firstName, lastName } = await Validate.update(req.body);

    const result = await Account.findOneAndUpdate(
      { _id: req.user },
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select("-_id firstName lastName");

    res.status(200).json(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

/**
 * Delete the current account.
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
exports.account_delete = async function (req, res, next) {
  try {
    let result = {
      deletedCount: 0,
    };
    const activityResult = await activity_controller.deleteActivitiesByOwnerId(
      req.user
    );
    const inventoryResult = await inventory_controller.deleteInventoryByOwnerId(
      req.user
    );
    if (activityResult.deletedCount && inventoryResult.deletedCount) {
      result = await Account.deleteOne({ _id: req.user });
    }

    res.status(200).json(result.deletedCount);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

function generateToken(account_id) {
  const payload = {
    _id: account_id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY);
}
