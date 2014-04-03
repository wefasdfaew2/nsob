"use strict";

var winston = require('winston');

module.exports.setup = function(cb) {
  global.l = winston;
  cb();
};
