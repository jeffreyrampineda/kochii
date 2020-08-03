const Koa = require('koa');
const http = require('http');
const mongoose = require('mongoose');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const errorHandler = require('./middlewares/errorHandler');
const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const { passport } = require('./passport');
const helmet = require('koa-helmet');
const path = require('path');
const render = require('koa-ejs');
const mount = require('koa-mount');

// Create Koa Application
const app = new Koa();
const routerProtected = new Router();
const routerPublic = new Router();
const server = http.createServer(app.callback());
const io = socket(server);

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

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layouts/template',
    viewExt: 'html',
    cache: false,
    debug: true
});

app.use(errorHandler);
app.use(cors());
app.use(bodyParser());

// Authentication
app.use(passport.initialize());

// Routes
app.use(require('koa-static')(__dirname + '/public', {
    maxage: 365 * 24 * 60 * 60
}));
app.use(mount('/app', require('koa-static')(__dirname + '/client/dist')));

require('./controllers').protected(routerProtected, passport);
require('./controllers').public(routerPublic);
app.use(routerProtected.routes());
app.use(routerPublic.routes());

mongoose.connect(process.env.MONGODB_URI,
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
