const Router = require('koa-router');
const UserService = require('../services/user.service');
const router = new Router();

router.del('/', async (ctx) => {
    try {
        const result = await UserService.deleteUserById(ctx.state.user._id);
        ctx.body = result.ok;
    } catch (error) {
        ctx.throw(500, error);
    }
});

module.exports = router.routes();
