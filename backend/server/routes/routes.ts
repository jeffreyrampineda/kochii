import { InventoryRoute } from './inventory.routes';
import { RecipesRoute } from './recipes.routes';
import { HistoryRoute } from './history.routes';
import { PublicRoute } from './public.routes';

export default (router) => {
    router.use('/api/inventory', InventoryRoute)
    router.use('/api/recipes', RecipesRoute)
    router.use('/api/history', HistoryRoute);
    router.use('/public', PublicRoute);
}