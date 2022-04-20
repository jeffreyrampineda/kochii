const jwt = require('jsonwebtoken');

function generateToken(account_id) {
    const payload = {
        _id: account_id,
    }
    return jwt.sign(payload, process.env.SECRET_KEY);
}

function decodeToken(token) {
    //console.log("jwt: token decoded.")
    return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = {
    generateToken,
    decodeToken
};
