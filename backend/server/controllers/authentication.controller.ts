import UserModel from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken';

// TODO: encryption. bcrypt requires python2.x
class AuthenticationController {

    // TODO: documentation.
    async login(ctx) {
        try {
            if (Object.keys(ctx.request.body).length != 2) {
                throw new Error('Corrupted request');
            }

            const result = await UserModel.findOne({ 
                username: ctx.request.body.username,
                password: ctx.request.body.password
            });

            if (!result) {
                throw new Error('Authentication failed');
            }

            // 202-Accepted
            ctx.status = 202;
            ctx.body = {
                // _id:
                username: ctx.request.body.username,
                password: ctx.request.body.password,
                token: jsonwebtoken.sign(result.toJSON(), 'shared-secret')
            };
        } catch (err) {
            let status = 400;
            let message = 'Unknown';

            if (err.message === 'Authentication failed') {
                // 401-Unauthorized
                status = 401;
                message = err.message;
            } else {
                console.log(err.status);
                console.log(err.message);
            }

            ctx.status = status;
            ctx.message = message;
        }
    }

    /**
     * Registers the user to the database. If username already exists,
     * UserModel throws an error causing a status 409.
     */
    async register(ctx) {
        const passwordMinimumLength = 6;

        try {
            if (Object.keys(ctx.request.body).length != 3) {
                throw new Error('Corrupted request');
            }
    
            if (ctx.request.body.password.length < passwordMinimumLength) {
                throw new Error('Password too short');
            }

            const user = new UserModel({
                username: ctx.request.body.username,
                password: ctx.request.body.password
            });

            // Can throw an error. 'Username already exists'
            const result = await user.save();
        
            // 202-Accepted
            ctx.status = 202;
            ctx.body = {
                username: ctx.request.body.username,
                password: ctx.request.body.password,
                token: jsonwebtoken.sign(result.toJSON(), 'shared-secret')
            };
        } catch (err) {
            let status = 400;
            let message = 'Unknown';

            if (err.message === 'Password too short') {
                // 406-Not Acceptable
                status = 406;
                message = err.message;
            } else if (err.message === 'Username already exists') {
                // 409-Conflict
                status = 409;
                message = err.message;
            } else {
                console.log(err.status);
                console.log(err.message);
            }

            ctx.status = status;
            ctx.message = message;
        }
    }

}

export default new AuthenticationController();