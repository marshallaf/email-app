const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// using this way (instead of require) prevents multiple
// includes of 'users', esp. in testing scenarios
const User = mongoose.model('users');

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id })
    .then(existingUser => {
      if (existingUser) {
        // we already have a record with the given google id
        done(null, existingUser);
      } else {
        // this is a new user
        new User({ googleId: profile.id })
          .save()
          .then(savedUser => {
            done(null, savedUser);
          });
      }
    });
}));
