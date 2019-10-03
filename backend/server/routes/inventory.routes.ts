import * as Router from 'koa-router';
import InventoryController from '../controllers/inventory.controller';

const router = new Router();

router.get('/', InventoryController.getAll)
router.get('/names', InventoryController.getByNames)
router.get('/search/:name', InventoryController.searchByName)
router.get('/id/:id', InventoryController.getById)
router.get('/:name', InventoryController.getByName)
router.post('/', InventoryController.create)
router.put('/:option/:name/:expirationDate', InventoryController.update)
router.del('/', InventoryController.deleteMany);
router.del('/:id', InventoryController.delete)

export const InventoryRoute = router.routes();