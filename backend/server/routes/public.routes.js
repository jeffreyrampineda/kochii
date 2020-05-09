const Router = require('koa-router');
const AuthenticationController = require('../controllers/authentication.controller');

const router = new Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);

module.exports = router.routes();
