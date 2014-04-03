"use strict";

var users = require('./users')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    users.authUser({email: email, password: password}, function(err, user) {

      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect email/password!' });
      }

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports.requireAuthentication = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    if (req.xhr) {
      req.flash('loginError', 'Session expired!');
      res.json({ status: 'redirect', url: '/auth?uri=' + encodeURIComponent('/admin')});
    } else {
      res.redirect('/auth?uri=' + encodeURIComponent(req.originalUrl));
    }
  }
};
