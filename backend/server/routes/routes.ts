import { InventoryRoute } from './inventory.routes';
import { RecipesRoute } from './recipes.routes';

export default (router) => {
    router.prefix('/api');
    router.use('/inventory', InventoryRoute)
    router.use('/recipes', RecipesRoute)
}