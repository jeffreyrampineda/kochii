import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as mongoose from 'mongoose';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import routes from './routes/routes';
import logger from './middlewares/logger';

// Create Koa Application
const app = new Koa();
const port = process.env.PORT || 3001;
const db_host = process.env.DB_HOST || 'localhost';
const API_URL = "http://localhost:4200"
const options:cors.CorsOptions = {
    allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    allowMethods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: API_URL
};
const router = new Router();

routes(router);

app.use(cors(options));
app.use(jwt({ secret: 'shared-secret' }).unless({ path: [/^\/public/] }));
app.use(logger());
app.use(bodyParser());
app.use(router.routes());

mongoose.connect(`mongodb://${db_host}:27017/kochii`, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

// Start the application
app.listen(port, () => console.log(`The server is running at http://localhost:${port}/`));