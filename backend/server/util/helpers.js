const jsonwebtoken = require('jsonwebtoken');

function generateToken(signature) {
    return jsonwebtoken.sign(signature, process.env.SECRET_KEY);
}

module.exports = {
    generateToken
};