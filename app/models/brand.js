"use strict";

var kit = global.kit;

kit.define('brand', {
  name: {
    type: kit.types.STRING,
    required: true
  },
  titleLine: kit.types.STRING,
  text: kit.types.TEXT,
  date: kit.types.DOUBLE,
  logo: kit.types.STRING,
  section: kit.types.STRING,
  category: kit.types.STRING,
  room: kit.types.STRING,
  floor: kit.types.STRING
});
