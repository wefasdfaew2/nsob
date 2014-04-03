"use strict";

var fs = require("fs")
  , _ = require('lodash')
  , controllers = require(global.config.get('path').controllers)
  , app = global.app
  , multipart = require('connect-multiparty');

var routes = {
  routeData: [],

  add: function(route) {
    if (!route.uri) {
      throw new Error("Route definition requires URI!");
    }

    routes.routeData.push(route);
    route.method = route.method || 'get';

    if (_.isFunction(route.func) || (_.isArray(route.func) && route.func.length > 0)) {
      var cbs = [].concat(route.func);
      if (route.fileUpload) {
        cbs.unshift(multipart());
        cbs.push(function(req) {
          _.forEach(req.files, function(file) {
            fs.unlink(file.path);
          });
        });
      }
      if (route.nav) {
        cbs.unshift(route.nav.middleware.bind(route.nav, routes));
      }
      app[route.method](route.uri, cbs);
    }
  }
};

fs.readdirSync(__dirname).forEach(function(name) {
  if (name.match(/^(?!index.js).*.js$/i)) {
    require('./' + name).bind(routes, controllers);
    l.info("loaded route '" + name.replace(/.js$/, '') + "'");
  }
});
