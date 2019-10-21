import * as Router from 'koa-router';
import InventoryController from '../controllers/inventory.controller';

const router = new Router();

router.get('/', InventoryController.getAll)
router.get('/search/:name', InventoryController.searchByName)
router.get('/:name', InventoryController.getByName)
router.get('/names', InventoryController.getByNames)
router.get('/id/:id', InventoryController.getById)
router.post('/', InventoryController.create)
router.put('/:option/:name/:expirationDate', InventoryController.update)

export const InventoryRoute = router.routes();