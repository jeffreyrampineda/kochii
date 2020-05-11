const User = require('../models/user');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const passwordMinimumLength = 6;
const saltRounds = 10;

function generateToken(signature) {
    return jsonwebtoken.sign(signature, process.env.SECRET_KEY);
}

// TODO: documentation.
async function login(ctx) {
    const { username, password, } = ctx.request.body;

    const user = await User.findOne({
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
        token: generateToken(user.toJSON())
    };
}

/**
 * Registers the user to the database. If username already exists,
 * UserModel throws an error causing a status 409.
 */
async function register(ctx) {
    const { username, password, } = ctx.request.body;

    if (password.length < passwordMinimumLength) {
        ctx.throw(400, 'Password too short');
    }

    await bcrypt.hash(password, saltRounds).then(async (hash) => {
        try {
            const result = await User.create({
                username,
                password: hash,
            });

            // 202-Accepted
            ctx.status = 202;
            ctx.body = {
                token: generateToken(result.toJSON())
            };

        } catch (error) {
            if (error.message === 'Username already exists') {
                ctx.throw(409, 'Username already exists');
            }
            ctx.throw(500, 'Register error');
        }
    });
}

module.exports = {
    login,
    register
};
