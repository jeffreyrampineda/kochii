import * as Router from 'koa-router';
import AuthenticationController from '../controllers/authentication.controller';

const router = new Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);

export const PublicRoute = router.routes();