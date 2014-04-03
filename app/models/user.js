"use strict";

var kit = global.kit;

kit.define('user', {
  email: {
    type: kit.types.STRING,
    required: true,
    unique: true
  },
  password: {
    type: kit.types.STRING,
    required: true,
    hidden: true
  },
  firstName: kit.types.STRING,
  lastName: kit.types.STRING,
  timeZoneOffset: kit.types.INT
});
