const Koa = require('koa');
const http = require('http');
const mongoose = require('mongoose');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const socket = require('socket.io');
const { passport, jwt } = require('./passport');

// Create Koa Application
const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socket(server);

global.io = io;

// Debug mode
if (process.env.NODE_ENV !== 'production') {
    app.use(logger());
}

app.use(errorHandler);
app.use(cors());
app.use(bodyParser());

// Authentication
app.use(passport.initialize());
app.use(jwt.unless({ path: [/^\/public/, /^\/dev/] }));

// Api routes
require('./routes')(router);
app.use(router.routes());

mongoose.connect(process.env.MONGODB_URI_development, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

io.on('connection', (socket) => {
    console.log('user connected');
});

module.exports = server;
