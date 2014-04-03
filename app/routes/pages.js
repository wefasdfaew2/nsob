"use strict";

var Nav = require(global.config.get('path').helpers + '/nav')
  , nav = new Nav();

module.exports.bind = function(routes, controllers) {

  routes.add({
    uri: '/',
    func: controllers.pages.index
  });

  routes.add({
    uri: '/visit/about',
    func: controllers.pages.about
  });

  routes.add({
    uri: '/visit/how-to-get',
    func: controllers.pages.howToGet
  });

  routes.add({
    uri: '/levels/first-floor',
    func: controllers.pages.firstLevel
  });

  routes.add({
    uri: '/levels/second-floor',
    func: controllers.pages.secondLevel
  });

  routes.add({
    uri: '/levels/third-floor',
    func: controllers.pages.thirdLevel
  });


  routes.add({
    uri: '/events',
    func: controllers.pages.events
  });

  routes.add({
    uri: '/event/:id/:slug',
    func: controllers.pages.event
  });

  routes.add({
    uri: '/shop',
    func: controllers.pages.shop
  });

  routes.add({
    uri: '/entertain',
    func: controllers.pages.entertain
  });

  routes.add({
    uri: '/dine',
    func: controllers.pages.dine
  });

  routes.add({
    uri: '/parking',
    func: controllers.pages.parking
  });

  routes.add({
    uri: '/brand/:id/:name',
    func: controllers.pages.brand
  });

  routes.add({
    uri: '/bus',
    func: controllers.pages.bus
  });
};
