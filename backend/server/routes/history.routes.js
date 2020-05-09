const Router = require('koa-router');
const HistoryController = require('../controllers/history.controller');

const router = new Router();

router.get('/', HistoryController.getAll);
router.del('/', HistoryController.deleteAll);

module.exports = router.routes();
