const Router = require('koa-router');
const sendfile = require('koa-sendfile');
const sendContactEmail = require('../services/external_api.service').sendContactEmail;

const router = new Router();

router.post('send', async (ctx) => {
    try {
        const { from_email, from_name, body } = ctx.request.body;
        sendContactEmail(from_email, from_name, body);

        ctx.redirect('/sent');
    } catch (error) {
        ctx.throw(400, error);
    }
});

router.get('(.*)', async (ctx) => {
    await sendfile(ctx, __dirname + '/../client/dist/index.html');
});

module.exports = router.routes();
