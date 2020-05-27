const jsonwebtoken = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        _id: user._id
    }
    return jsonwebtoken.sign(payload, process.env.SECRET_KEY);
}

module.exports = {
    generateToken
};
