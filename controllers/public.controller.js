const Router = require('koa-router');
const sendfile = require('koa-sendfile');
const sendContactEmail = require('../services/external_api.service').sendContactEmail;

const router = new Router();

router.get(['login', 'register', 'app/*'], async (ctx) => {
    await sendfile(ctx, __dirname + '/../client/dist/index.html');
});

router.get('/*', async (ctx) => {
    await sendfile(ctx, __dirname + '/../public/index.html');
});

module.exports = router.routes();
