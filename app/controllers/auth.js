"use strict";

var passport = require('passport');

module.exports = {

  authPage: function(req, res) {
    res.render('auth/index', {
      uri: encodeURIComponent(req.query.uri),
      errors: req.flash('loginError') || []
    });
  },

  authAction: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        next(err);
        return;
      }

      if (!user) {
        req.flash('loginError', info.message);
        res.redirect('/auth?uri=' + encodeURIComponent(req.query.uri));
        return;
      }

      req.logIn(user, function(err) {
        if (err) {
          next(err);
          return;
        }

        var url = req.query.uri != 'undefined' ? req.query.uri : '/';
        res.redirect(url);
      });
    })(req, res, next);
  },

  signOut: function(req, res) {
    req.logout();
    res.redirect('/admin');
  }

};
