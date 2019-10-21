import * as Router from 'koa-router';
import HistoryController from '../controllers/history.controller';

const router = new Router();

router.get('/', HistoryController.getAll);
router.del('/', HistoryController.deleteAll);

export const HistoryRoute = router.routes();