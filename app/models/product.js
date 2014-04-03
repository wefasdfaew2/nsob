"use strict";

var kit = global.kit;

kit.define('product', {
  type: {
    type: kit.types.STRING,
    required: true
  },
  model: {
    type: kit.types.STRING,
    required: true
  },
  picture: {
    type: kit.types.STRING,
    required: true
  },
  description:{
    type:  kit.types.TEXT,
    required: true
  },
  parametrs: {
    type:  kit.types.TEXT,
    required: true
  }

});
