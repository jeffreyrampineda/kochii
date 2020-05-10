const Router = require('koa-router');
const InventoryController = require('../controllers/inventory.controller');

const router = new Router();

router.get('/', InventoryController.getAll);
router.get('/search/:name', InventoryController.searchByName);
router.get('/names', InventoryController.getByNames);
router.post('/', InventoryController.create);
router.put('/:option', InventoryController.update);

module.exports = router.routes();
