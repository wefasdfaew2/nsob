"use strict";

var kit = global.kit;

kit.define('image', {
  file: {
    type: kit.types.STRING,
    required: true
  },
  entity: {
    type: kit.types.INT,
    required: true
  },
  type: {
    type: kit.types.STRING,
    required: true
  },
  order: {
    type: kit.types.INT
  }
});
