import UserModel from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken';
const bcrypt = require('bcrypt');
const config = require('../config.json');

class AuthenticationController {

    private readonly passwordMinimumLength = 6;
    private readonly saltRounds = 10;

    private generateToken(signature: any): string {
        return jsonwebtoken.sign(signature, config.secretKey);
    }

    private verifyBody(body: any): boolean {
        return Object.keys(body).length == 2;
    }

    // TODO: documentation.
    login = async (ctx) => {
        try {

            // Length should be 2, username and password.
            if (!this.verifyBody(ctx.request.body)) {
                throw new Error('Corrupted request');
            }

            const username = ctx.request.body.username;
            const password = ctx.request.body.password;

            const user = await UserModel.findOne({ 
                username: username,
            });

            // Username and password should exist.
            if (!user) {
                throw new Error('Username does not exist');
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new Error('Authentication failed');
            }

            // 202-Accepted
            ctx.status = 202;
            ctx.body = {
                token: this.generateToken(user.toJSON())
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
    register = async (ctx) => {
        try {

            // TODO: Should be 3. Username and password. no passwordRe
            if (Object.keys(ctx.request.body).length != 3) {
                throw new Error('Corrupted request');
            }
    
            const username = ctx.request.body.username;
            const password = ctx.request.body.password;

            if (password.length < this.passwordMinimumLength) {
                throw new Error('Password too short');
            }

            await bcrypt.hash(password, this.saltRounds).then(async (hash) => {
                const user = new UserModel({
                    username: username,
                    password: hash
                });

                // Can throw an error. 'Username already exists'
                const result = await user.save();

                // 202-Accepted
                ctx.status = 202;
                ctx.body = {
                    token: this.generateToken(result.toJSON())
                };
            });
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