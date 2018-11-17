import * as Router from 'koa-router';
import InventoryController from '../controllers/inventory.controller';

const router = new Router();

router.prefix('/api/inventory');

// GET /api/inventory
router.get('/', InventoryController.getInventory)

export const InventoryRoute = router.routes();