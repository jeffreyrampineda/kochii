const Router = require('koa-router');
const ActivityService = require('../services/activity.service');

const router = new Router();

/**
 * GET /api/activities
 * Get all the user's activities from the database.
 * @response { JSON, error? } array of activities objects if successful otherwise, an error. 
 */
router.get('/', async (ctx) => {
    try {
        ctx.body = await ActivityService.getActivities(ctx.state.user);
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * GET /api/activities/:days
 * Gets all items and activities from the database since the specified days.
 * @requires { number } days
 * @response { JSON, error? } An object that contains activities and items.
 */
router.get('/:days', async (ctx) => {
    try {
        const { days = 1 } = ctx.params;
        ctx.body = await ActivityService.getActivitiesSince(ctx.state.user, days);
    } catch (error) {
        ctx.throw(500, error);
    }
});

router.del('/', async (ctx) => {
    try {
        ctx.body = await ActivityService.clearActivities(ctx.state.user);
    } catch (error) {
        ctw.throw(500, error);
    }
});

module.exports = router.routes();
