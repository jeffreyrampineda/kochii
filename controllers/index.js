module.exports = {
    protected: (router, passport) => {
        router.use(passport.authenticate("jwt", { session: false }));
        router.use('/api/inventory', require('./inventory.controller'));
        router.use('/api/groups', require('./group.controller'));
        router.use('/api/history', require('./history.controller'));
        router.use('/api/account', require('./account.controller'));
    },
    public: (router) => {
        router.use('/api', require('./authentication.controller'));
        router.use('/', require('./public.controller.js'));
    }
}
