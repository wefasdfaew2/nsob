"use strict";

var Nav = function() {

};

Nav.prototype.middleware = function(routes, req, res, next) {
  res.locals.menuItems = this.menuItems.bind(this, routes);
  next();
};

Nav.prototype.menuItems = function(routes) {
  return routes.routeData;
};

module.exports = Nav;
