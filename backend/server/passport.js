const passport = require("koa-passport"),
      User = require('./models/user'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({ _id: jwt_payload._id }).then(user => {
        if (user) {
            const trimmed = {
                _id: user._id,
            }
            return done(null, trimmed);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = {
    passport,
};
