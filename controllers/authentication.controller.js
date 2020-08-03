const Router = require('koa-router');
const UserService = require('../services/user.service');
const Helper = require('../util/helpers');
const Validate = require('../validators/user');
const router = new Router();

/**
 * POST /api/login
 * Authenticates the user to the database.
 * @requires { body } username, password
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post('/login', async (ctx) => {
    try {
        const { errors, username, password } = await Validate.login(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(401, JSON.stringify(errors));
        }

        const user = await UserService.getUserByName(username);

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
});

/**
 * POST /api/register
 * Registers the user to the database.
 * @requires { body } username, password, email
 * @response { JSON, error? } jwt if successful otherwise, an error.
 */
router.post('/register', async (ctx) => {
    try {
        const { errors, username, password, email } = await Validate.register(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }

        const user = await UserService.init(
            username,
            password,
            email,
        );

        // 202 - Accepted
        ctx.status = 202;
        ctx.body = {
            token: Helper.generateToken(user.toJSON()),
            isVerified: user.isVerified,
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

        const user = await UserService.getUserByEmail(email);
        let response = "loading...";

        if (user && user.isVerified) {
            response = "User is already verified";
        } else if (user && user.compareTokens(token)) {
            const verifyResult = await UserService.verify(user, email);
            response = verifyResult ? "User has been verified" : "an error has occured";
        } else {
            response = "Token is expired";
        }

        ctx.status = 202;
        ctx.body = response;
    } catch (error) {
        ctx.throw(401, error);
    }
});

module.exports = router.routes();
