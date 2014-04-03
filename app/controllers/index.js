"use strict";

var fs = require("fs");

fs.readdirSync(__dirname).forEach(function(name) {
  if (name.match(/^(?!index.js).*.js$/i)) {
    name = name.replace('.js', '');
    module.exports[name] = require('./' + name);
  }
});
