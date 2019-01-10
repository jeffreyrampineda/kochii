import { InventoryRoute } from './inventory.routes';

export default (router) => {
    router.prefix('/api');
    router.use('/inventory', InventoryRoute)
}