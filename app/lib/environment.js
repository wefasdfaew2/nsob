"use strict";

var Mincer = require("mincer")
  , path = require("path");

Mincer.logger.use(console);

Mincer.StylusEngine.configure(function(stylus) {
  stylus.set("include css", true);
  stylus.use(require("nib")());
  stylus.use(require("stylus-type-utils")());
});

var environment = module.exports = new Mincer.Environment(global.root);

environment.registerHelper('asset_path', function(name, opts) {
  var asset = environment.findAsset(name, opts);
  if (!asset) {
    throw new Error("File [" + name + "] not found");
  }

  return'/assets/' + asset.digestPath;
});

environment.appendPath("assets/scripts");
environment.appendPath("assets/styles");
environment.appendPath("assets/images");
environment.appendPath("assets/fonts");
environment.appendPath("assets/vendor/bootstrap/js");
environment.appendPath("assets/vendor/bootstrap/less");
environment.appendPath("assets/vendor/anytime");
environment.appendPath("assets/vendor/chosen");
environment.appendPath("assets/vendor/qtip2");

environment.cache = new Mincer.FileStore(path.join(global.root, 'cache'));
