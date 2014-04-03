"use strict";

var users = require(global.config.get('path').lib + '/users')
  , config = global.config;

module.exports = {

  index: function(req, res) {
    res.render('emergency/index');
  },

  processToken: function(req, res) {
    if (config.get('ENV') == 'production') {
      res.redirect('/admin');
      return;
    }

    res.redirect(req.query.uri + '?token=' + req.body.token);
  },

  newUser: function(req, res) {
    res.render('emergency/newUser', {
      errors: req.flash('createError') || []
    });
  },

  createUser: function(req, res) {
    var email = req.body.email
      , password = req.body.password
      , confirmPassword = req.body['confirm-password'];

    if (!email.match(/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i)) {
      req.flash('createError', 'Invalid e-mail address!');
      res.redirect('/emergency-console/new-user?token=' + res.locals.token);
      return;
    }

    if (password.length < 6 || password !== confirmPassword) {
      req.flash('createError', 'Password error!');
      res.redirect('/emergency-console/new-user?token=' + res.locals.token);
      return;
    }

    users.addUser({
      email: email,
      password: password
    }, function(err, id) {
      if (err) {
        req.flash('createError', error.toString());
        res.redirect('/emergency-console/new-user?token=' + res.locals.token);
        return;
      }

      res.redirect('/emergency-console?token=' + res.locals.token);
    });
  }

};
