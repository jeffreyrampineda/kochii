import UserModel from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken';

class AuthenticationController {

    // TODO: documentation.
    async login(ctx) {
        try {
            const result = await UserModel.findOne({ 
                username: ctx.request.body.username,
                password: ctx.request.body.password
            });

            if (!result) {
                throw new Error('Authentication failed.');
            }

            ctx.body = {
                // _id:
                username: ctx.request.body.username,
                password: ctx.request.body.password,
                token: jsonwebtoken.sign(result.toJSON(), 'shared-secret')
            };
        } catch (err) {
            ctx.status = err.status || 401;
            ctx.body = err.message;
        }
    }
}

export default new AuthenticationController();