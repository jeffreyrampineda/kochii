module.exports = (router) => {
    router.use('/api/inventory', require('./inventory.routes'));
    router.use('/api/groups', require('./groups.routes'));
    router.use('/api/history', require('./history.routes'));
    router.use('/public', require('./public.routes'));
    router.use('/dev', require('./dev.routes'));
};
