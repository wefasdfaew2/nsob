#!/usr/bin/env node
"use strict";

var Mincer = require("mincer")
  , fs = require("fs")
  , wrench = require("wrench");

var rootDir = __dirname + '/..'
  , assetsDir = rootDir + "/assets"
  , publicDir = rootDir + "/public/assets";

if (fs.existsSync(publicDir)) {
  wrench.rmdirSyncRecursive(publicDir);
}

Mincer.logger.use(console);

Mincer.StylusEngine.configure(function(stylus) {
  stylus.set("include css", true);
  stylus.use(require("nib")());
  stylus.use(require("stylus-type-utils")());
});

Mincer.UglifyCompressor.configure({ output: { comments: /^!|@preserve|@license|@cc_on/ } });

var environment = new Mincer.Environment(rootDir);

environment.registerHelper('asset_path', function(name, opts) {
  var asset = environment.findAsset(name, opts);
  if (!asset){
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

environment.jsCompressor = "uglify";
environment.cssCompressor = "csso";

var manifest = new Mincer.Manifest(environment, publicDir);

// generate files list to compile
var fileList = ['*.eot', '*.ttf', '*.woff', '*.png', '*.jpg', '*.jpeg', '*.svg', '*.gif', '*.ico', '*.js'];
wrench.readdirSyncRecursive(assetsDir + "/styles").forEach(function(name) {
  if (name.match(/\.styl/i)) {
    fileList.push(name.replace(/.styl$/i, ''));
  }
});

manifest.compile(fileList, function (err, assetsData) {
  if (err) {
    console.error("Failed compile assets: " + (err.message || err.toString()));
    process.exit(128);
  }

  console.info("\n\nAssets were successfully compiled.\n" +
    "Manifest data (a proper JSON) was written to:\n" +
    manifest.path + "\n\n");
});
