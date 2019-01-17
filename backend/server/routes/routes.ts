import { InventoryRoute } from './inventory.routes';
import { RecipesRoute } from './recipes.routes';
import { HistoryRoute } from './history.routes';

export default (router) => {
    router.prefix('/api');
    router.use('/inventory', InventoryRoute)
    router.use('/recipes', RecipesRoute)
    router.use('/history', HistoryRoute);
}