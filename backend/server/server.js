const Koa = require('koa');
const http = require('http');
const mongoose = require('mongoose');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
// const socket = require('socket.io');

// Create Koa Application
const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
// const io = socket(server);

// Debug mode
if (process.env.NODE_ENV !== 'production') {
    app.use(logger());
}

app.use(errorHandler);
app.use(cors());
app.use(jwt({ secret: process.env.SECRET_KEY }).unless({ path: [/^\/public/, /^\/dev/] }));
app.use(bodyParser());

// Api routes
require('./routes')(router);
app.use(router.routes());

mongoose.connect(process.env.MONGODB_URI_development, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

// io.on('connection', (socket) => {
//    console.log('user connected');
// });

module.exports = server;
