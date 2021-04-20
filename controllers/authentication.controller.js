const Router = require('koa-router');
const AccountService = require('../services/account.service');
const Helper = require('../util/helpers');
const Validate = require('../validators/account');
const router = new Router();

/**
 * POST /api/login
 * Authenticates the Account to the database.
 * @requires { body } accountName, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post('/login', async (ctx) => {
    try {
        const { errors, accountName, password } = await Validate.login(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(401, JSON.stringify(errors));
        }

        const account = await AccountService.getAccountByName(accountName);

        // Account should exist and should have matching passwords.
        if (account && account.comparePasswords(password)) {

            // 202 - Accepted.
            ctx.status = 202;
            ctx.body = {
                accountName: account.accountName,
                email: account.email,
                firstName: account.firstName,
                lastName: account.lastName,
                token: Helper.generateToken(account._id),
                isVerified: account.isVerified,
            };
        } else {
            ctx.throw(401, JSON.stringify({ login: "Authentication failed" }));
        }
    } catch (error) {
        ctx.throw(401, error);
    }
});

/**
 * POST /api/register
 * Registers the account to the database.
 * @requires { body } accountName, password, email, firstName, lastName
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post('/register', async (ctx) => {
    try {
        const { errors, accountName, password, email, firstName, lastName } = await Validate.register(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const account = await AccountService.init(
            accountName,
            password,
            email,
            firstName,
            lastName
        );

        // 202 - Accepted
        ctx.status = 202;
        ctx.body = {
            accountName,
            email,
            firstName,
            lastName,
            token: Helper.generateToken(account._id),
            isVerified: account.isVerified,
        };
    } catch (error) {
        ctx.throw(400, error);
    }
});

/**
 * GET /api/verification?token=token&email=email
 * Verifies the token and email.
 * @requires { query } token, email
 * @response { JSON, error? } the result.
 */
router.get('/verification', async (ctx) => {
    try {
        const { errors, token, email } = await Validate.verify(ctx.request.query);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        let response = "loading...";

        const verifyResult = await AccountService.verify(token, email);
        response = verifyResult ? "Account has been verified" : "Verification failed.";

        ctx.status = 202;
        ctx.body = response;
    } catch (error) {
        ctx.throw(401, error);
    }
});

module.exports = router.routes();
