const Router = require('koa-router');
const AccountService = require('../services/account.service');
const router = new Router();

router.del('/', async (ctx) => {
    try {
        const result = await AccountService.deleteAccountById(ctx.state.user._id);
        ctx.body = result.ok;
    } catch (error) {
        ctx.throw(500, error);
    }
});

module.exports = router.routes();
