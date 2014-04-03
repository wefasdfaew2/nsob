"use strict";

var config = global.config;

module.exports.bind = function(routes, controllers) {

  routes.add({
    uri: '/emergency-console/process-token',
    method: 'post',
    func: controllers.emergency.processToken
  });

  routes.add({
    uri: '/emergency-console*',
    method: 'all',
    func: function(req, res, next) {
      if (config.get('ENV') == 'production') {
        res.redirect('/admin');
      } else {
        if (!req.session.sessionToken) {
          require('crypto').randomBytes(48, function(ex, buf) {
            l.warn(req.session.sessionToken = buf.toString('hex'));
            res.redirect('/emergency-console');
          });
          return;
        }

        if (req.query.token != req.session.sessionToken) {
          res.render('emergency/inputToken', {
            uri: encodeURIComponent(req.originalUrl),
            title: 'Token'
          });
          return;
        }

        res.locals.token = req.query.token;

        next();
      }
    }
  });

  routes.add({
    uri: '/emergency-console',
    func: controllers.emergency.index
  });

  routes.add({
    uri: '/emergency-console/new-user',
    func: controllers.emergency.newUser
  });

  routes.add({
    uri: '/emergency-console/new-user',
    method: 'post',
    func: controllers.emergency.createUser
  })

};
