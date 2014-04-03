"use strict";

var hasher = require('pbkdf2-hasher')
  , kit = global.kit;

module.exports = {
  addUser: function(user, callback) {
    hasher.generate(user.password, function(err, hash) {
      if (err) {
        callback(err);
        return;
      }

      user.password = hash;
      kit.models.user.build(user).save(callback);
    });
  },

  authUser: function(user, callback) {
    kit.models.user.find({ include: ['password'], where: { email: user.email } }, function(err, result) {
      if (err) {
        return callback(err, null);
      }

      if (result.length == 0) {
        return callback(null, null);
      }

      return hasher.verify(user.password, result[0].password, function(err, verified) {
        if (err) {
          return callback(err, null);
        }

        if (verified) {
          result[0].password = null;
          return callback(null, result[0])
        } else {
          return callback(null, null);
        }
      });
    });
  },

  updateUser: function(user, callback) {
    kit.models.user.update(
      { id: user.id },
      { email: user.email, firstName: user.firstName, lastName: user.lastName },
      callback
    );
  },

  updatePassword: function(user, callback) {
    hasher.generate(user.password, function(err, hash) {
      if (err) {
        callback(err);
        return;
      }

      kit.models.user.update(
        { id: user.id },
        { password: hash },
        callback
      );
    });
  }
};
