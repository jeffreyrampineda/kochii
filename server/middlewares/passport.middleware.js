const passport = require('passport');
const Account = require('../models/account');
const { Strategy, ExtractJwt } = require('passport-jwt');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY || 'secret_key',
};

passport.use(
  new Strategy(opts, function (jwt_payload, done) {
    Account.findOne({ _id: jwt_payload._id }).then((account) => {
      if (account) {
        return done(null, account._id);
      } else {
        return done(null, false);
      }
    });
  }),
);

module.exports = passport;
