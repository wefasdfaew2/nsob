"use strict";

module.exports.bind = function(routes, controllers) {

  routes.add({
    uri: '/auth',
    func: controllers.auth.authPage
  });

  routes.add({
    uri: '/auth',
    method: 'post',
    func: controllers.auth.authAction
  });

  routes.add({
    uri: '/auth/signout',
    func: controllers.auth.signOut
  });

};
