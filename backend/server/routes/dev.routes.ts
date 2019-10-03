import * as Router from 'koa-router';
import GroupController from '../controllers/group.controller';

const router = new Router();

router.get('/refresh/group/:name', GroupController.refreshSize);

export const DevRoute = router.routes();