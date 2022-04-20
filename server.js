const Koa = require('koa');
const http = require('http');
const mongoose = require('mongoose');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const errorHandler = require('./middlewares/errorHandler');
const socket = require('socket.io');
const { passport } = require('./passport');
const helmet = require('koa-helmet');
const { decodeToken } = require('./util/helpers');

// Create Koa Application
const app = new Koa();
const routerProtected = new Router();
const routerPublic = new Router();
const server = http.createServer(app.callback());
const io = socket(server, {
    cors: {
      origin: "http://localhost:4200"
    }
});

global.currentConnections = {};

// Security
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds }));

// Debug mode
if (process.env.NODE_ENV !== 'production') {
    app.use(logger());
}

app.use(errorHandler);
app.use(cors());
app.use(bodyParser());

// Authentication
app.use(passport.initialize());

// Routes
app.use(require('koa-static')(__dirname + '/client/dist', {
    maxage: 365 * 24 * 60 * 60
}));

require('./controllers').protected(routerProtected, passport);
require('./controllers').public(routerPublic);
app.use(routerProtected.routes());
app.use(routerPublic.routes());

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connection to mongodb established'));

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("invalid token"));
    }
    //console.log("socket: requesting new connection");
    //console.log('socket: decoding token');
    const decoded_token = decodeToken(token);

    if (global.currentConnections[decoded_token._id] === undefined) {
        global.currentConnections[decoded_token._id] = {};
    }

    // For multiple connections/logins in one account.
    global.currentConnections[decoded_token._id][socket.id] = { socket };
    socket.emit('authenticated');
    console.log('socket: connection authenticated');

    socket.on('disconnect', () => {
        delete global.currentConnections[decoded_token._id][socket.id];
        console.log('socket: connection disconnect');
    });
    next();
});

module.exports = server;
