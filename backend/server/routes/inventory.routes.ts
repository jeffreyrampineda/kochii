import * as Router from 'koa-router';
import InventoryController from '../controllers/inventory.controller';

const router = new Router();

router.get('/', InventoryController.getAll)
router.get('/search/:name', InventoryController.searchByName)
router.get('/id/:id', InventoryController.getById)
router.get('/:name', InventoryController.getByName)
router.post('/', InventoryController.create)
router.put('/:name/:expirationDate', InventoryController.upsert)
router.put('/:id', InventoryController.update)
router.del('/:id', InventoryController.delete)
router.del('/', InventoryController.deleteMany);

export const InventoryRoute = router.routes();