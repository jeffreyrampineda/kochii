const sendfile = require('koa-sendfile');

module.exports = {
    protected: (router, passport) => {
        router.use(passport.authenticate("jwt", { session: false }));
        router.use('/api/inventory', require('./inventory.controller'));
        router.use('/api/groups', require('./group.controller'));
        router.use('/api/history', require('./history.controller'));
    },
    public: (router) => {
        router.use('/public', require('./authentication.controller'));
        router.get(['/login', '/register', '/app/*'], async (ctx) => {
            await sendfile(ctx, __dirname + '/../client/dist/index.html');
        });
        router.get('/', async (ctx) => {
            await ctx.render('pages/home');
        });
        router.get('/legal/terms-of-service', async (ctx) => {
            await ctx.render('pages/legal/termsofservice');
        });
        router.get('/legal/privacy-policy', async (ctx) => {
            await ctx.render('pages/legal/privacypolicy');
        });
    }
}
