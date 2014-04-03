"use strict";

var nconf = require('nconf');

module.exports.setup = function(cb) {
  var appDir = global.root + '/app';

  nconf.env()
    .file({ file: global.root + '/config.json' })
    .defaults({
      'ENV': nconf.get('NODE_ENV') || 'development',
      'PORT': process.getuid() + 2000,
      'sessionSecret': 'please override me!',
      'locales': ['en'],
      'dbAutoSync': true,
      'path': {
        'root': global.root,
        'assets': global.root + '/assets',
        'uploads': global.root + '/uploads',
        'app': appDir,
        'lib': appDir + '/lib',
        'helpers': appDir + '/helpers',
        'routes': appDir + '/routes',
        'controllers': appDir + '/controllers',
        'models': appDir + '/models',
        'views': appDir + '/views'
      },
      'allowedImageTypes': ['image/jpeg', 'image/png', 'image/gif']
    });

  global.config = nconf;

  cb();
};
