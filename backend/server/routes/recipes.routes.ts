import * as Router from 'koa-router';
import RecipesController from '../controllers/recipes.controller';

const router = new Router();

router.get('/', RecipesController.getAll)
router.get('/search/:name', RecipesController.searchByName)
router.get('/:name', RecipesController.getByName)
router.get('/:id', RecipesController.getById)
router.post('/', RecipesController.create)
router.put('/:id', RecipesController.update)
router.del('/:id', RecipesController.delete)

export const RecipesRoute = router.routes();