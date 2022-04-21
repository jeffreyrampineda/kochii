const express = require("express");
const router = express.Router();
const AccountService = require("../services/account.service");
const Helper = require("../util/helpers");
const Validate = require("../validators/account");
const createError = require("http-errors");

/**
 * POST /api/public/login
 * Authenticates the Account to the database.
 * @requires { body } accountName, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post("/login", async function (req, res, next) {
  try {
    const { accountName, password } = await Validate.login(req.body);

    const account = await AccountService.getAccountByName(accountName);

    // Account should exist and should have matching passwords.
    if (account && account.comparePasswords(password)) {
      // 202 - Accepted.
      res.status(202).json({
        accountName: account.accountName,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        token: Helper.generateToken(account._id),
        isVerified: account.isVerified,
      });
    } else {
      throw { status: 401, error_messages: ["Authentication failed"] };
    }
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
});

/**
 * POST /api/public/register
 * Registers the account to the database.
 * @requires { body } accountName, password, email, firstName, lastName
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post("/register", async function (req, res, next) {
  try {
    const { accountName, password, email, firstName, lastName } =
      await Validate.register(req.body);

    const account = await AccountService.init(
      accountName,
      password,
      email,
      firstName,
      lastName
    );

    // 202 - Accepted
    res.status(202).json({
      accountName,
      email,
      firstName,
      lastName,
      token: Helper.generateToken(account._id),
      isVerified: account.isVerified,
    });
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
});

/**
 * GET /api/public/verification?token=token&email=email
 * Verifies the token and email.
 * @requires { query } token, email
 * @response { JSON, error? } the result.
 */
router.get("/verification", async function (req, res, next) {
  try {
    const { token, email } = await Validate.verify(req.query);

    let response = "loading...";

    const verifyResult = await AccountService.verify(token, email);
    response = verifyResult
      ? "Account has been verified"
      : "Verification failed.";

    res.status(202).send(response);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
});

module.exports = router;
