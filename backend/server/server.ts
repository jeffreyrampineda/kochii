import * as Koa from 'koa';
import { InventoryRoute } from './routes/inventory.route';
import * as mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/kochii');

mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));


// Create Koa Application
const app = new Koa();

app.use(InventoryRoute);

// Start the application
app.listen(3000, () => console.log('The server is running at http://localhost:3000/'));