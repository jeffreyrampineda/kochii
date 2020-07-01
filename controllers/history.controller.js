const Router = require('koa-router');
const History = require('../models/history');

const router = new Router();

/**
 * GET /api/history
 * Get all the user's history from the database.
 * @response { JSON, error? } array of history objects if successful otherwise, an error. 
 */
router.get('/', async (ctx) => {
    try {
        const h = await History.findOne({ owner: ctx.state.user._id }, 'history');

        ctx.body = h.history;
    } catch (error) {
        ctx.throw(500, error);
    }
});

/**
 * GET /api/history/:days
 * Gets all items and history from the database since the specified days.
 * @requires { number } days
 * @response { JSON, error? } An object that contains history and items.
 */
router.get('/:days', async (ctx) => {
    try {
        const { days = 1 } = ctx.params;
        const fromDay = new Date();

        fromDay.setDate(fromDay.getDate() - days);
        fromDay.setHours(0, 0, 0, 0);

        const his = await History.findOne({ owner: ctx.state.user._id }, 'history');

        const rec = his.history.filter(hi => hi.addedDate.getTime() > fromDay.getTime());

        ctx.body = rec;
    } catch (error) {
        ctx.throw(500, error);
    }
});

router.del('/', async (ctx) => {
    try {
        const result = await History.findOneAndUpdate(
            { owner: ctx.state.user._id },
            { $pull: { history: {} } },
            { new: true, rawResult: true }
        );

        ctx.body = result.ok;
    } catch (error) {
        ctw.throw(500, error);
    }
});

module.exports = router.routes();
