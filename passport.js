const passport = require("passport"),
  Account = require("./models/account"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY || "secret_key",
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    Account.findOne({ _id: jwt_payload._id }).then((account) => {
      if (account) {
        return done(null, account._id);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = {
  passport,
};
