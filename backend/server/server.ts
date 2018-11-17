import * as Koa from 'koa';
import { InventoryRoute } from './routes/inventory.route';

const app = new Koa();

app.use(InventoryRoute);

// Start the application
app.listen(3000, () => console.log('The server is running at http://localhost:3000/'));