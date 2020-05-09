const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

class AuthenticationController {

    passwordMinimumLength = 6;
    saltRounds = 10;

    generateToken(signature) {
        return jsonwebtoken.sign(signature, process.env.SECRET_KEY);
    }

    verifyBody(body) {
        return Object.keys(body).length == 2;
    }

    // TODO: documentation.
    login = async (ctx) => {

        // Length should be 2, username and password.
        if (!this.verifyBody(ctx.request.body)) {
            ctx.throw(400, 'Bad Request');
        }

        const { username, password, } = ctx.request.body;

        const user = await UserModel.findOne({ 
            username,
        });

        // Username and password should exist.
        if (!user) {
            ctx.throw(401, 'Authentication failed');
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            ctx.throw(401, 'Authentication failed');
        }

        // 202-Accepted
        ctx.status = 202;
        ctx.body = {
            token: this.generateToken(user.toJSON())
        };
    }

    /**
     * Registers the user to the database. If username already exists,
     * UserModel throws an error causing a status 409.
     */
    register = async (ctx) => {
        // TODO: Should be 3. Username and password. no passwordRe
        if (Object.keys(ctx.request.body).length != 3) {
            ctx.throw(400, 'Bad Request');
        }
    
        const { username, password, } = ctx.request.body;

        if (password.length < this.passwordMinimumLength) {
            ctx.throw(400, 'Password too short');
        }

        await bcrypt.hash(password, this.saltRounds).then(async (hash) => {
            const user = new UserModel({
                username,
                password: hash,
            });

            try {

                // Can throw an error. 'Username already exists'
                const result = await user.save();

                // 202-Accepted
                ctx.status = 202;
                ctx.body = {
                    token: this.generateToken(result.toJSON())
                };

            } catch (error) {
                if (error.message === 'Username already exists') {
                    ctx.throw(409, 'Username already exists');
                }
                ctx.throw(500, 'Register error');
            }
        });
    }
}

module.exports = new AuthenticationController();
