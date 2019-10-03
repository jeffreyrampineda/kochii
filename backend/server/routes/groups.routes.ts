import * as Router from 'koa-router';
import GroupController from '../controllers/group.controller';

const router = new Router();

router.get('/', GroupController.getAll);
router.get('/groups/:groupName', GroupController.getItems);
router.post('/', GroupController.create);
router.del('/:name', GroupController.delete);

export const GroupsRoute = router.routes();