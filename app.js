"use strict";

require('async').series([
  function(cb) {
    process.on('SIGINT', function() {
      console.log('SIGINT. shutting down');
      process.exit(0);
    });

    process.on('SIGTERM', function() {
      console.log('SIGTERM. shutting down');
      process.exit(0);
    });

    global.root = __dirname;
    require(__dirname + "/app/lib/config").setup(cb);
  },
  function(cb) {
    require(global.config.get('path').lib + '/log').setup(cb);
  },
  function(cb) {
    require(global.config.get('path').lib + '/db').setup(cb);
  },
  function(cb) {
    require(global.config.get('path').lib + '/http').setup(cb);
  }
], function() {
  global.app.run();
});
