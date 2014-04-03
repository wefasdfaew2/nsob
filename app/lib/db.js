"use strict";

var Kit = require('db-kit')
  , config = global.config;

module.exports.setup = function(cb) {
  var kit = global.kit = new Kit({
    connString: config.get('postgresUrl'),
    debug: config.get('ENV') != 'production'
  });

  require(config.get('path').models);

  if (config.get('dbAutoSync')) {
    l.info('syncing database schema');
    kit.sync(function(err) {
      if (!err) {
        l.info("database synced");
        cb();
      } else {
        l.error(err);
      }
    });
  } else {
    cb();
  }
};
