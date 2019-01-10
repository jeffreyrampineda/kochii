import * as Router from 'koa-router';
import InventoryController from '../controllers/inventory.controller';

const router = new Router();

router.get('/', InventoryController.getAll)
router.get('/search/:name', InventoryController.searchByName)

export const InventoryRoute = router.routes();