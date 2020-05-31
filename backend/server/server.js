const Koa = require('koa');
const http = require('http');
const mongoose = require('mongoose');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const { passport, jwt } = require('./passport');

// Create Koa Application
const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socket(server);

global.currentConnections = {};

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

mongoose.connect(process.env.MONGODB_URI_development,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

io.on('connection', socketioJwt.authorize({
    secret: process.env.SECRET_KEY,
    timeout: 15000 // 15 seconds to send the authentication message
}));
io.on('authenticated', (socket) => {
    if (global.currentConnections[socket.decoded_token._id] === undefined) {
        global.currentConnections[socket.decoded_token._id] = {};
    }

    // For multiple connections/logins in one user.
    global.currentConnections[socket.decoded_token._id][socket.id] = { socket };
    console.log('authenticated');

    socket.on('disconnect', () => {
        delete global.currentConnections[socket.decoded_token._id][socket.id];
        console.log('disconnect');
    });
});

module.exports = server;
