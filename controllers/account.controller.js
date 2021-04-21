const Router = require('koa-router');
const AccountService = require('../services/account.service');
const Validate = require('../validators/account');
const router = new Router();

/**
 * PUT /api/account
 * Updates the current account.
 * @response { JSON, error? } updated account if successful otherwise, an error.
 */
 router.put('/', async (ctx) => {
    try {
        const { errors, firstName, lastName } = await Validate.update(ctx.request.body);

        if (Object.keys(errors).length) {
            ctx.throw(400, JSON.stringify(errors));
        }
        ctx.body = await AccountService.updateAccount(ctx.state.user, firstName, lastName);

    } catch (error) {
        ctx.throw(400, error);
    }
});

/**
 * DEL /api/account
 * Delete the current account. 
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
router.del('/', async (ctx) => {
    try {
        const result = await AccountService.deleteAccountById(ctx.state.user);
        ctx.body = result.ok;
    } catch (error) {
        ctx.throw(500, error);
    }
});

module.exports = router.routes();
