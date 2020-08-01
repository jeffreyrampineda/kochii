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
            await ctx.render('pages/home', {
                title: 'Personal Inventory | Kochii',
                description: 'Kochii assists and encourages individuals for a manageable meal preparation lifestyle.'
            });
        });
        router.get('/legal/terms-of-service', async (ctx) => {
            await ctx.render('pages/legal/termsofservice', {
                title: 'Legal Information | Kochii',
                description: 'Legal stuff you need to be aware of and agree to when you use Kochii.'
            });
        });
        router.get('/legal/privacy-policy', async (ctx) => {
            await ctx.render('pages/legal/privacypolicy', {
                title: 'Privacy | Kochii',
                description: 'Read about what Kochii does to respect and protect your privacy.'
            });
        });
    }
}
