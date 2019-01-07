import * as Koa from 'koa';
import { InventoryRoute } from './routes/inventory.route';
import * as mongoose from 'mongoose';
import * as cors from '@koa/cors';

mongoose.connect('mongodb://localhost/kochii', { useNewUrlParser: true });

mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

// Create Koa Application
const app = new Koa();
const port = process.env.PORT || 3001
const API_URL = "http://localhost:4200"

const options:cors.CorsOptions = {
    allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    allowMethods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: API_URL
};

app.use(cors(options));
app.use(InventoryRoute);

// Start the application
app.listen(port, () => console.log(`The server is running at http://localhost:${port}/`));