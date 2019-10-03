import { InventoryRoute } from './inventory.routes';
import { GroupsRoute } from './groups.routes';
import { RecipesRoute } from './recipes.routes';
import { HistoryRoute } from './history.routes';
import { PublicRoute } from './public.routes';
import { DevRoute } from './dev.routes';

export default (router) => {
    router.use('/api/inventory', InventoryRoute)
    router.use('/api/groups', GroupsRoute);
    router.use('/api/recipes', RecipesRoute)
    router.use('/api/history', HistoryRoute);
    router.use('/public', PublicRoute);
    router.use('/dev', DevRoute);
}