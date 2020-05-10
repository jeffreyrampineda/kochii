const Router = require('koa-router');
const GroupController = require('../controllers/group.controller');

const router = new Router();

router.get('/', GroupController.getAll);
router.post('/:name', GroupController.create);
router.del('/:name', GroupController.delete);

module.exports = router.routes();
