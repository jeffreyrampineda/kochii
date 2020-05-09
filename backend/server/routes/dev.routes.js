const Router = require('koa-router');
const GroupController = require('../controllers/group.controller');

const router = new Router();

router.get('/refresh/group/:name', GroupController.refreshSize);

module.exports = router.routes();
