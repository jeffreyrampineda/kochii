const jsonwebtoken = require('jsonwebtoken');

function generateToken(account_id) {
    const payload = {
        _id: account_id,
    }
    return jsonwebtoken.sign(payload, process.env.SECRET_KEY);
}

module.exports = {
    generateToken
};
