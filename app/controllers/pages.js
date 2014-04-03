"use strict";

var kit = global.kit
  , S = require('string')
  , async = require('async')
  , _ = require('lodash')
  , moment = require('moment');

module.exports = {
  index: function(req, res) {
    kit.models.homeBox.find({ order: ['homeBox.order ASC'] }, function(err, results) {
      var tasks = []
        , boxes = [];
      _.forEach(results, function(result) {
        switch(result.type) {
          case 'custom':
            tasks.push(function(cb) {
              cb(null, result);
            });
            break;
          case 'events':
            tasks.push(function(cb) {
              kit.models.event.find({ where: { id: result.contentId } }, function(err, rs) {
                cb(err, rs[0] || {});
              });
            });
            break;
          case 'news':
            tasks.push(function(cb) {
              kit.models.news.find({ where: { id: result.contentId } }, function(err, rs) {
                cb(err, rs[0] || {});
              });
            });
            break;
          case 'brands':
            tasks.push(function(cb) {
              kit.models.brand.find({ where: { id: result.contentId } }, function(err, rs) {
                rs[0].type = 'brand';
                if (!err && rs.length > 0) {
                  var v = rs[0];
                  kit.models.image.find({ where: { entity: v.id, type: 'brand' }, order: ['image.order ASC'] }, function(e, imgs) {
                    v.image = imgs.length > 0 ? (imgs[2] ? imgs[2].file : imgs[1].file) : null;
                    cb(err, v || {});
                  });
                } else {
                  cb(err, rs[0] || {});
                }
              });
            });
            break;
        }
      });

      async.series(tasks, function(err, rls) {
        boxes = rls;
        res.render('index', { boxes: boxes, moment: moment, S: S });
      });
    });
  },

  howToGet: function(req, res) {
    kit.models.section.find({ where: { name: 'how-to-get' } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }

      kit.models.image.find({where: {entity: results[0].id, type: "section"}},function(err,images) {
        if (err) {
          res.redirect('/');
          return;
        }

        res.render('howToGet', { section: results[0], images:images });
      });
    });
  },

  about: function(req, res) {
    kit.models.section.find({ where: { name: 'about' } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }

      kit.models.image.find({where: {entity: results[0].id, type: "section"}, order: ['image.order ASC']},function(err,images) {
        if (err) {
          res.redirect('/');
          return;
        }

        res.render('about', { section: results[0], images:images });
      });
    });
  },

  firstLevel: function(req, res) {
    kit.models.brand.find({ where: { floor: 1 }, order: ['brand.name ASC'] }, function(err, brands) {
      if (err) {
        res.redirect('/');
        return;
      }
      kit.models.section.find({ where: { name: 'first-floor' } }, function(err, results) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('firstLevel', { brands: brands, section: results[0], S: S });
      });
    });
  },

  secondLevel: function(req, res) {
    kit.models.brand.find({ where: { floor: 2 }, order: ['brand.name ASC'] }, function(err, brands) {
      if (err) {
        res.redirect('/');
        return;
      }
      kit.models.section.find({ where: { name: 'second-floor' } }, function(err, results) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('secondLevel', { brands: brands, section: results[0], S: S });
      });
    });
  },

  thirdLevel: function(req, res) {
    kit.models.brand.find({ where: { floor: 3 }, order: ['brand.name ASC'] }, function(err, brands) {
      if (err) {
        res.redirect('/');
        return;
      }
      kit.models.section.find({ where: { name: 'third-floor' } }, function(err, results) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('thirdLevel', { brands: brands, section: results[0], S: S });
      });
    });
  },

  entertain: function(req, res) {
    kit.models.brand.find({ where: { section: 'entertain' }, order: ['brand.name ASC'] }, function(err, results) {
      res.render('entertain', { S: S, brands: results });
    });
  },

  dine: function(req, res) {
    kit.models.brand.find({ where: { section: 'dine' }, order: ['brand.name ASC'] }, function(err, results) {
      res.render('dine', { S: S, brands: results });
    });
  },

  events: function(req, res) {
    kit.models.event.find({ order: ['event.date DESC'] }, function(err, results) {
      res.render('events', { events: results, moment: moment, S: S });
    });
  },

  event: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/');
      return;
    }

    kit.models.event.find({ where: { id: id } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }

      var event = results[0];

      kit.models.image.find({ where: { entity: event.id, type: 'event' }, order: ['image.order ASC'] }, function(err, images) {
        if (err) {
          res.redirect('/');
          return;
        }

        event.images = images;
        res.render('event', { event: event, moment: moment });
      });
    });
  },

  shop: function(req, res) {
    kit.models.brand.find({ where: { section: 'shop' }, order: ['brand.name ASC'] }, function(err, results) {
      res.render('shop', { S: S, brands: results });
    });
  },

  parking: function(req, res) {
    kit.models.section.find({ where: { name: 'parking' } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }

      kit.models.image.find({where: {entity: results[0].id, type: "section"}},function(err,images) {
        if (err) {
          res.redirect('/');
          return;
        }

        res.render('parking', { section: results[0], images:images });
      });
    });
  },

  brand: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/');
      return;
    }

    kit.models.brand.find({ where: { id: id } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }
      kit.models.image.find({where: {entity: id, type: "brand"}, order: ['image.order ASC']}, function(err,images) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('brand', { moment: moment, brand: results[0], S: S, images:images});
      });
    });
  },

    product: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/');
      return;
    }

    kit.models.product.find({ where: { id: id } }, function(err, results) {
      if (err || results.length == 0) {
        res.redirect('/');
        return;
      }
      kit.models.image.find({where: {entity: id, type: "product"}, order: ['image.order ASC']}, function(err,images) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('product', { moment: moment, product: results[0], S: S, images:images});
      });
    });
  },

  bus: function(req, res) {
    res.render('bus');
  }
};
