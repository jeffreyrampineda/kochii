const passport = require("passport"),
      Account = require('./models/account'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Account.findOne({ _id: jwt_payload._id }).then(account => {
        if (account) {
            const account_id = account._id;
            return done(null, account_id);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = {
    passport,
};
