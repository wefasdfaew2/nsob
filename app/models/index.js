"use strict";

var fs = require('fs');

fs.readdirSync(__dirname).forEach(function(name) {
  if (name.match(/^(?!index.js).*.js$/i)) {
    require('./' + name);
    l.info("loaded model '" + name.replace(/.js$/, '') + "'");
  }
});
