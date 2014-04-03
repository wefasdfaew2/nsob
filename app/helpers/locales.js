"use strict";

var _ = require('lodash');

var Locales = function(options) {
  this.definedLocales = options.locales;
  this.defaultLocale = this.definedLocales[0];
};

Locales.prototype.middleware = function(req, res, next) {
  var splittedUri = _.rest(req.url.split('/'));
  var firstPart = _.first(splittedUri);

  if (this.definedLocales.indexOf(firstPart) != -1) {
    req.session.locale = firstPart;
    req.url = '/' + _.rest(splittedUri).join('/');
    res.cookie('locale', firstPart, { maxAge: 2592000000, httpOnly: true });
  } else {
    req.session.locale = req.cookies.locale || this.defaultLocale;
  }

  res.locals.currentLocale = this.current.bind(req);
  res.locals.locales = this.locales.bind(req, this);
  res.locals._l = this._l.bind(req, this);
  res.locals._o = this._o.bind(req, this);
  next();
};

Locales.prototype.current = function() {
  return { locale: this.session.locale, uri: '/' + this.session.locale + this.url };
};

Locales.prototype.locales = function(locales) {
  var loc = [];
  _.forEach(locales.definedLocales, function(locale) {
    loc.push({ locale: locale, uri:'/' + locale + this.url });
  }, this);

  return loc;
};

Locales.prototype.encode = function(object) {
  return JSON.stringify(object);
};

Locales.prototype.decode = function(string) {
  return JSON.parse(string);
};

Locales.prototype._l = function(locales) {
  var langIndex = locales.definedLocales.indexOf(this.session.locale);
  return arguments[langIndex + 1];
};

Locales.prototype._o = function(locales) {
  if (!arguments[1]) return '';

  if (_.isString(arguments[1])) {
    arguments[1] = locales.decode(arguments[1]);
  }

  return arguments[1][arguments[2] || this.session.locale];
};

module.exports = Locales;
