var express = require('express')
  , device = require('express-device')
  , connect = require('connect')
  , FileStore = require('connect-file-store')(connect)
  , Mincer = require('mincer')
  , environment = require('./environment')
  , path = require('path')
  , passport = require('passport')
  , config = global.config
  , flash = require('connect-flash')
  , os = require('os')
  , Locales = require(config.get('path').helpers + '/locales')
  , locales = global.locales = new Locales({
    locales: config.get('locales')
  })
  , manifest = null;

if (config.get('ENV') == 'production') {
  manifest = require(global.root + '/public/assets/manifest.json');
}

require('./auth');

module.exports.setup = function(cb) {
  var app = global.app = express();

  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', config.get('path').views);
    app.use(express.favicon());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(device.capture());
    app.enableDeviceHelpers();
    app.enableViewRouting({
        "noPartials":true
    });
    app.use(express.cookieParser());
    if (config.get('ENV') == 'production') {
      app.use(express.session({
        secret: config.get('sessionSecret'),
        store: new FileStore({
          path: os.tmpdir(),
        })
      }));
    } else {
      app.use(express.session({secret: config.get('sessionSecret')}));
    }
    app.use(flash());
    // authentication support
    app.use(passport.initialize());
    app.use(passport.session());
  });

  app.configure('development', function() {
    app.use(express.logger('dev'));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  app.use(locales.middleware.bind(locales));

  // dummy helper that injects extension
  function rewrite_extension(source, ext) {
    var source_ext = path.extname(source);
    return (source_ext === ext) ? source : (source + ext);
  }

  // returns a list of asset paths
  function find_asset_paths(logicalPath, ext) {
    var paths = [];

    if (config.get('ENV') !== 'production') {
      var asset = environment.findAsset(logicalPath);
      if (!asset) {
        return null;
      }
      asset.toArray().forEach(function (dep) {
        paths.push('/assets/' + rewrite_extension(dep.logicalPath, ext) + '?r=' + Math.random());
      });
    } else {
      paths.push('/assets/' + rewrite_extension(manifest.assets[logicalPath], ext));
    }

    return paths;
  }

  var js = function javascript(logicalPath) {
    var paths = find_asset_paths(logicalPath, '.js');

    if (!paths) {
      // this will help us notify that given logicalPath is not found
      // without "breaking" view renderer
      return '<script>alert("Javascript file ' +
        JSON.stringify(logicalPath).replace(/"/g, '\\"') +
        ' not found.")</script>';
    }

    return paths.map(function (path) {
      if (config.get('ENV') == 'production') {
        return '<script>(function(){function js(){var element=document.createElement("script");element.src="'+path+'";document.body.appendChild(element);} if(window.addEventListener)window.addEventListener("load",js,false);else if(window.attachEvent)window.attachEvent("onload",js);else window.onload=js;})();</script>';
      } else {
        return '<script src="' + path + '"></script>';
      }
    }).join('\n');
  };

  var css = function stylesheet(logicalPath) {
    var paths = find_asset_paths(logicalPath, '.css');

    if (!paths) {
      // this will help us notify that given logicalPath is not found
      // without "breaking" view renderer
      return '<script>alert("Stylesheet file ' +
        JSON.stringify(logicalPath).replace(/"/g, '\\"') +
        ' not found.")</script>';
    }

    return paths.map(function (path) {
      return '<link rel="stylesheet" type="text/css" href="' + path + '" />';
    }).join('\n');
  };

  var asset_path = function(name, opts) {
    var asset = environment.findAsset(name, opts);
    if (!asset){
      throw new Error("File [" + name + "] not found");
    }

    return'/assets/' + asset.digestPath;
  };

  app.use(function(req, res, next) {
    res.locals.js = js;
    res.locals.css = css;
    res.locals.asset_path = asset_path;
    res.locals.url = req.get('host') + req.url;
    res.locals.path = req.path;
    next();
  });

  app.use(app.router);

  // catch errors

  app.use(function (err, req, res, next) {
    if (config.get('ENV') != 'production') { l.error(err.stack); }

    res.status(err.status || 500);
    res.render('base/500', { error: err });
  });


  if (config.get('ENV') == 'production') {
    app.use('/assets/', express.static(global.root + '/public/assets'));
  } else {
    app.use('/assets/', Mincer.createServer(environment));
    app.use('/uploads/', express.static(global.root + '/uploads'));
  }

  // not found status
  app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      return res.render('base/404', { url: req.url });
    }

    // respond with json
    if (req.accepts('json')) {
      return res.send({ error: 'Not found' });
    }

    // default to plain-text. send()
    return res.type('txt').send('Not found');
  });

  require(config.get('path').routes);

  app.run = function() {
    app.listen(config.get('PORT')).on('error', function(err) {
      l.error('Error starting web server! - ' + err.message);
    }).on('listening', function() {
        l.info('Web server listening on port ' + config.get('PORT'));
      });
  };

  cb();
};
