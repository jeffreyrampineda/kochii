const sendfile = require('koa-sendfile');

module.exports = {
    protected: (router, passport) => {
        router.use(passport.authenticate("jwt", { session: false }));
        router.use('/api/inventory', require('./inventory.routes'));
        router.use('/api/groups', require('./groups.routes'));
        router.use('/api/history', require('./history.routes'));
    },
    public: (router) => {
        router.use('/public', require('./public.routes'));
        router.use('/dev', require('./dev.routes'));
        router.get('*', async (ctx) => {
            await sendfile(ctx, __dirname + '/../../../frontend/dist/index.html');
        });
    }
}
