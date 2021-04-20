const jsonwebtoken = require('jsonwebtoken');

function generateToken(account) {
    const payload = {
        _id: account._id,
    }
    return jsonwebtoken.sign(payload, process.env.SECRET_KEY);
}

module.exports = {
    generateToken
};
