const Router = require('koa-router');
const HistoryController = require('../controllers/history.controller');

const router = new Router();

router.get('/', HistoryController.getAll);
router.get('/:days', HistoryController.getAllFromPastDays);
router.del('/', HistoryController.deleteAll);

module.exports = router.routes();
