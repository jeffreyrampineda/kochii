const Router = require('koa-router');
const AuthenticationController = require('../controllers/authentication.controller');

const router = new Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.get('/verification', AuthenticationController.verify);

module.exports = router.routes();
