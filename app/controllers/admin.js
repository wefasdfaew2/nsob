"use strict";

var users = require(global.config.get('path').lib + '/users')
  , kit = global.kit
  , config = global.config
  , fs = require('fs')
  , uuid = require('uuid')
  , path = require('path')
  , _ = require('lodash')
  , moment = require('moment')
  , locales = global.locales
  , async = require('async');

var fileName = function() {
  return uuid.v4();
};

module.exports = {

  index: function(req, res) {
    res.render('admin/index');
  },

  // ####################################

  homepage: function(req, res) {
    kit.models.homeBox.find({ order: ['homeBox.order ASC'] }, function(err, results) {

      var tasks = []
        , boxes = [];

      _.forEach(results, function(result) {
        switch(result.type) {
          case 'custom':
            result.bid = result.id;
            tasks.push(function(cb) {
              cb(null, result);
            });
            break;
          case 'events':
            tasks.push(function(cb) {
              kit.models.event.find({ where: { id: result.contentId } }, function(err, rs) {
                if (rs[0]) {
                  rs[0].type = 'events';
                  rs[0].bid = result.id;
                }
                cb(err, rs[0] || {});
              });
            });
            break;
          case 'news':
            tasks.push(function(cb) {
              kit.models.news.find({ where: { id: result.contentId } }, function(err, rs) {
                if (rs[0]) {
                  rs[0].type = 'news';
                  rs[0].bid = result.id;
                }
                cb(err, rs[0] || {});
              });
            });
            break;
          case 'brands':
            tasks.push(function(cb) {
              kit.models.brand.find({ where: { id: result.contentId } }, function(err, rs) {
                if (rs[0]) {
                  rs[0].type = 'brands';
                  rs[0].bid = result.id;
                }
                cb(err, rs[0] || {});
              });
            });
            break;
        }
      });

      async.series(tasks, function(err, rls) {
        boxes = rls;
        res.render('admin/homepage', { boxes: boxes });
      });
    });
  },

  createHomebox: function(req, res) {
    var form = req.flash('form');

    kit.models.news.find({}, function(err, news) {
      if (err) {
        res.redirect('/admin/homepage');
        return;
      }

      kit.models.event.find({}, function(err, events) {
        if (err) {
          res.redirect('/admin/homepage');
          return;
        }

        kit.models.brand.find({}, function(err, brands) {
          if (err) {
            res.redirect('/admin/homepage');
            return;
          }

          res.render('admin/createHomebox', { errors: req.flash('homeboxError') || [] ,
            form: form.length > 0 ? form[0] : {} ,
            news: news,
            events: events,
            brands: brands
          });
        });
      });
    });
  },

  createHomeboxSave: function(req, res) {
    var type = req.body.type
      , order = req.body.order;

    order = parseInt(order);

    if (isNaN(order)) {
      order = 0;
    }

    var homebox = kit.models.homeBox.build({
      type: type,
      order: order
    });

    if (type == 'events') {
      homebox.contentId = parseInt(req.body.event);
    }

    if (type == 'news') {
      homebox.contentId = parseInt(req.body.news);
    }

    if (type == 'brands') {
      homebox.contentId = parseInt(req.body.brand);
    }

    if (type == 'custom') {
      homebox.title = locales.encode(req.body.title);
      homebox.subTitle = locales.encode(req.body.subTitle);
      homebox.date = req.body.date
      var dateEnabled = req.body.dateEnabled;

      if (homebox.date.length != 0 && dateEnabled) {
        var d = moment(homebox.date);
        if (d.isValid()) {
          homebox.date = d.utc().valueOf();
        } else {
          homebox.date = 0;
        }
      } else {
        homebox.date = 0;
      }

      homebox.link = req.body.link;

      if (req.files.image && req.files.image.size > 0) {
        if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
          var fileExt = path.extname(req.files.image.path);
          var newFileName = fileName() + fileExt;
          var is = fs.createReadStream(req.files.image.path);
          var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
          is.pipe(os);
          homebox.image = newFileName;
        }
      }
    }

    homebox.save(function(err, id) {
      if (err) {
        req.flash('homeboxError', err.toString());
        req.flash('form', req.body);
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/homeboxes/edit/' + id);
    });
  },

  editHomebox: function(req, res) {
    kit.models.news.find({}, function(err, news) {
      if (err) {
        res.redirect('/admin/homepage');
        return;
      }

      kit.models.event.find({}, function(err, events) {
        if (err) {
          res.redirect('/admin/homepage');
          return;
        }

        kit.models.brand.find({}, function(err, brands) {
          if (err) {
            res.redirect('/admin/homepage');
            return;
          }

          var homeboxId = parseInt(req.param('id'));

          if (isNaN(homeboxId)) {
            res.redirect('/admin/homepage');
            return;
          }

          kit.models.homeBox.find({ where: { id: homeboxId } }, function(err, results) {
            if (results.length == 0) {
              res.redirect('/admin/homepage');
              return;
            }

            res.render('admin/editHomebox', {
              errors: req.flash('homeboxError') || [] ,
              news: news,
              events: events,
              brands: brands,
              moment: moment,
              homebox: results[0]
            });
          });
        });
      });
    });
  },

  editHomeboxSave: function(req, res) {
    var type = req.body.type
      , order = req.body.order
      , id = req.param('id');

    order = parseInt(order);

    if (isNaN(order)) {
      order = 0;
    }

    if (isNaN(id)) {
      res.redirect('/admin/homepage');
      return;
    }

    var homebox = {
      type: type,
      order: order
    };

    if (type == 'events') {
      homebox.contentId = parseInt(req.body.event);
    }


    if (type == 'news') {
      homebox.contentId = parseInt(req.body.news);
    }

    if (type == 'brands') {
      homebox.contentId = parseInt(req.body.brand);
    }

    if (type == 'custom') {
      homebox.title = locales.encode(req.body.title);
      homebox.subTitle = locales.encode(req.body.subTitle);
      homebox.date = req.body.date;
      var dateEnabled = req.body.dateEnabled;

      if (homebox.date.length != 0 && dateEnabled) {
        var d = moment(homebox.date);
        if (d.isValid()) {
          homebox.date = d.utc().valueOf();
        } else {
          homebox.date = 0;
        }
      } else {
        homebox.date = 0;
      }

      homebox.link = req.body.link;

      if (req.files.image && req.files.image.size > 0) {
        if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
          var fileExt = path.extname(req.files.image.path);
          var newFileName = fileName() + fileExt;
          var is = fs.createReadStream(req.files.image.path);
          var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
          is.pipe(os);
          homebox.image = newFileName;
        }
      }
    }

    kit.models.homeBox.update({ id: id }, homebox, function(err) {
      if (err) {
        req.flash('homeboxError', err.toString());
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/homeboxes/edit/' + id);
    });
  },

  deleteHomebox: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/homepage');
      return;
    }

    kit.models.homeBox.delete({ id: id }, function() {
      res.redirect('/admin/homepage');
    });
  },

  deleteHomeboxImage: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/admin/homepage');
      return;
    }

    kit.models.homeBox.update({ id: id }, { image: '' }, function(err) {
      res.redirect('/admin/homeboxes/edit/' + id);
    });
  },

  // ####################################

  news: function(req, res) {
    kit.models.news.find({}, function(err, results) {
      res.render('admin/news', { news: results });
    });
  },

  editNews: function(req, res) {
    var newsId = parseInt(req.param('id'));

    if (isNaN(newsId)) {
      res.redirect('/admin/news');
      return;
    }

    kit.models.news.find({ where: { id: newsId } }, function(err, results) {
      if (results.length == 0) {
        res.redirect('/admin/news');
        return;
      }
        kit.models.image.find({where:{ entity: newsId, type:"news" }, order: ['image.order ASC'] }, function(err, images){
            if (err) {
                res.redirect('/admin/news');
                return;
            }
            res.render('admin/editNews', { news: results[0], moment: moment, images:images, errors: req.flash('newsError') || [] });
        });
    });
  },

  editNewsSave: function(req, res) {
    var title = locales.encode(req.body.title)
      , subTitle = locales.encode(req.body.subTitle)
      , link = req.body.link
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled
      , order = req.body.order
      , id = req.param('id');

    if (isNaN(id)) {
      res.redirect('/admin/news');
      return;
    }

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var news = {
      title: title,
      subTitle: subTitle,
      link: link,
      date: date
    };

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        news.image = newFileName;
      }
    }

    if (req.files.images && req.files.images.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.images.type) != -1) {
        var fileExt = path.extname(req.files.images.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.images.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);

        kit.models.image.build({
            file: newFileName,
            entity: id,
            type: 'news'
        }).save(function(err){});
      }
    }

    _.forEach(order, function(v, k) {
      k = parseInt(k.replace('id', ''));
      v = parseInt(v);

      if (isNaN(k) || isNaN(v)) return;

      kit.models.image.update({ id: k }, { order: v }, function() {});
    });

    kit.models.news.update({ id: id }, news, function(err) {
      if (err) {
        req.flash('newsError', err.toString());
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/news/edit/' + id);
    });
  },

  createNews: function(req, res) {
    var form = req.flash('form');

    res.render('admin/createNews', { errors: req.flash('newsError') || [] ,
      form: form.length > 0 ? form[0] : {}});
  },

  createNewsSave: function(req, res) {
    var title = locales.encode(req.body.title)
      , subTitle = locales.encode(req.body.subTitle)
      , link = req.body.link
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled;

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var news = kit.models.news.build({
      title: title,
      subTitle: subTitle,
      link: link,
      date: date
    });

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        news.image = newFileName;
      }
    }
    news.save(function(err, id) {
      if (err) {
        req.flash('newsError', err.toString());
        req.flash('form', req.body);
        l.warn(err.toString());
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/news/edit/' + id);
    });
  },

  deleteNews: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/news');
      return;
    }

    kit.models.homeBox.delete({ contentId: id, type: 'news' }, function() {
      kit.models.news.delete({ id: id }, function() {
        res.redirect('/admin/news');
      });
    });
  },

  deleteNewsImage: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/admin/news');
      return;
    }

    kit.models.news.update({ id: id }, { image: '' }, function(err) {
      res.redirect('/admin/news/edit/' + id);
    });
  },

  // ####################################

  events: function(req, res) {
    kit.models.event.find({}, function(err, results) {
      res.render('admin/events', { events: results });
    });
  },

  editEvent: function(req, res) {
    var eventId = parseInt(req.param('id'));

    if (isNaN(eventId)) {
      res.redirect('/admin/events');
      return;
    }

    kit.models.event.find({ where: { id: eventId } }, function(err, results) {
      if (results.length == 0) {
        res.redirect('/admin/events');
        return;
      }
        kit.models.image.find({where:{ entity: eventId, type:"event" }, order: ['image.order ASC'] }, function(err, images){
            if (err) {
                res.redirect('/admin/events');
                return;
            }
            res.render('admin/editEvent', { event: results[0], moment: moment, images:images, errors: req.flash('eventError') || [] });
        });
    });
  },

  editEventSave: function(req, res) {
    var title = locales.encode(req.body.title)
      , subTitle = locales.encode(req.body.subTitle)
      , text = locales.encode(req.body.text)
      , link = req.body.link
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled
      , order = req.body.order
      , id = req.param('id');

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var event = {
      title: title,
      subTitle: subTitle,
      text: text,
      link: link,
      date: date
    };

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        event.image = newFileName;
      }
    }

    if (req.files.images && req.files.images.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.images.type) != -1) {
        var fileExt = path.extname(req.files.images.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.images.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);

        kit.models.image.build({
            file: newFileName,
            entity: id,
            type: 'event'
        }).save(function(err){});
      }
    }

    _.forEach(order, function(v, k) {
      k = parseInt(k.replace('id', ''));
      v = parseInt(v);

      if (isNaN(k) || isNaN(v)) return;

      kit.models.image.update({ id: k }, { order: v }, function() {});
    });

    kit.models.event.update({ id: id }, event, function(err) {
      if (err) {
        req.flash('eventError', err.toString());
        res.redirect(req.originalUrl);
        return
      }
      res.redirect('/admin/events/edit/' + id);
    });
  },

  createEvent: function(req, res) {
    var form = req.flash('form');

    res.render('admin/createEvent', { errors: req.flash('eventError') || [] ,
      form: form.length > 0 ? form[0] : {}});
  },

  createEventSave: function(req, res) {
    var title = locales.encode(req.body.title)
      , subTitle = locales.encode(req.body.subTitle)
      , text = locales.encode(req.body.text)
      , link = req.body.link
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled;

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var event = kit.models.event.build({
      title: title,
      subTitle: subTitle,
      text: text,
      link: link,
      date: date
    });

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        event.image = newFileName;
      }
    }

    event.save(function(err, id) {
      if (err) {
        req.flash('eventError', err.toString());
        req.flash('form', req.body);
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/events/edit/' + id);
    });
  },

  deleteEvent: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/events');
      return;
    }

    kit.models.homeBox.delete({ contentId: id, type: 'events' }, function() {
      kit.models.event.delete({ id: id }, function() {
        res.redirect('/admin/events');
      });
    });
  },

  deleteEventImage: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/admin/events');
      return;
    }

    kit.models.event.update({ id: id }, { image: '' }, function(err) {
      res.redirect('/admin/events/edit/' + id);
    });
  },

  // ###############    BRANDS    #####################

  brands: function(req, res) {
    kit.models.brand.find({}, function(err, results) {
        console.log(results[0].name);
      res.render('admin/brands', { brands: results });
    });
  },

  brandsCreateView: function(req, res) {
    var form = req.flash('form');
    console.log(form,"brandsCreateView","Arman");
    res.render('admin/createBrand', { errors: req.flash('brandError') || [] ,
      form: form.length > 0 ? form[0] : {}});
  },

  brandsCreate: function(req, res) {
      console.log(req.body);
    var name = req.body.name
      , titleLine = req.body.titleLine
      , text = req.body.text
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled
      , section = req.body.section
      , category = ''
      , room = req.body.room || ''
      , floor = req.body.floor || '';

    switch(section) {
      case 'shop':
          category = req.body['shop-category'];
        break;
      case 'entertain':
          category = req.body['entertain-category'];
        break;
      case 'dine':
          category = req.body['dine-category'];
        break;
    }

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var brand = kit.models.brand.build({
      name: name,
      titleLine: titleLine,
      text: text,
      date: date,
      section: section,
      category: category,
      room: room,
      floor: floor
    });

    if (req.files.logo && req.files.logo.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.logo.type) != -1) {
        var fileExt = path.extname(req.files.logo.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.logo.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        brand.logo = newFileName;
      }
    }

    brand.save(function(err, id) {
      if (err) {
        req.flash('brandError', err.toString());
        req.flash('form', req.body);
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/brands');
    });
  },

  deleteBrand: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/brands');
      return;
    }

    kit.models.homeBox.delete({ contentId: id, type: 'brands' }, function() {
      kit.models.brand.delete({ id: id }, function() {
        res.redirect('/admin/brands');
      });
    });
  },

  deleteBrandLogo: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/admin/brands');
      return;
    }

    kit.models.brand.update({ id: id }, { logo: '' } , function(err) {
      res.redirect('/admin/brand/' + id);
    });
  },
  deleteImage: function(req, res) {
      var id   = parseInt(req.param('id'));

      if (isNaN(id)) {
          res.redirect('/admin/brands');
          return;
      }

      kit.models.image.delete({ id: id }, function(err) {
          res.redirect(req.get('Referrer'));
      });
  },

  brand: function(req, res) {
    var brandId = parseInt(req.param('id'));

    if (isNaN(brandId)) {
      res.redirect('/admin/brands');
      return;
    }

    kit.models.brand.find({ where: { id: brandId } }, function(err, results) {
      if (results.length == 0) {
        res.redirect('/admin/brands');
        return;
      }
      kit.models.image.find({where:{ entity: brandId, type:"brand" }, order: ['image.order ASC'] }, function(err, images){
          if (err) {
              res.redirect('/admin/brands');
              return;
          }
          res.render('admin/editBrand', { brand: results[0], images: images, moment: moment, errors: req.flash('brandError') || [] });
      });
    });
  },

  updateBrand: function(req, res) {
    var name = locales.encode(req.body.name)
      , titleLine = locales.encode(req.body.titleLine)
      , text = locales.encode(req.body.text)
      , date = req.body.date
      , dateEnabled = req.body.dateEnabled
      , section = req.body.section
      , category = ''
      , room = req.body.room || ''
      , floor = req.body.floor || ''
      , order = req.body.order
      , id = req.param('id');

    switch(section) {
      case 'shop':
          category = req.body['shop-category'];
        break;
      case 'entertain':
          category = req.body['entertain-category'];
        break;
      case 'dine':
          category = req.body['dine-category'];
        break;
    }

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var brand = {
      name: name,
      titleLine: titleLine,
      text: text,
      date: date,
      section: section,
      category: category,
      room: room,
      floor: floor
    };

    if (req.files.logo && req.files.logo.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.logo.type) != -1) {
        var fileExt = path.extname(req.files.logo.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.logo.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        brand.logo = newFileName;
      }
    }

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);

        kit.models.image.build({
            file: newFileName,
            entity: id,
            type: 'brand'
        }).save(function(err){});
      }
    }

    _.forEach(order, function(v, k) {
      k = parseInt(k.replace('id', ''));
      v = parseInt(v);

      if (isNaN(k) || isNaN(v)) return;

      kit.models.image.update({ id: k }, { order: v }, function() {});
    });

    kit.models.brand.update({ id: id }, brand, function(err) {
      if (err) {
        req.flash('brandError', err.toString());
        res.redirect(req.originalUrl);
        return
      }
      res.redirect('/admin/brands');
    });
  },

    // ###################################################    PRODUCTS    ######################################


  products: function(req, res) {
    kit.models.brand.find({}, function(err, results) {
      res.render('admin/products', { products: results });
    });
  },

  productsCreateView: function(req, res) {
    var form = req.flash('form');
    console.log(form,"productsCreateView","Arman");
    res.render('admin/createProduct', { errors: req.flash('productError') || [] ,
      form: form.length > 0 ? form[0] : {}});
    console.log("productsCreateView","Arman");
  },

  productsCreate: function(req, res) {
    var type = locales.encode(req.body.type)
      , model = locales.encode(req.body.model)
      , description = locales.encode(req.body.description)
      , parametrs = req.body.parametrs
      , section = req.body.section
      , category = '';
      console.log(req,body,"productsCreate","Arman");
    switch(section) {
      case 'shop':
          category = req.body['shop-category'];
        break;
      case 'entertain':
          category = req.body['entertain-category'];
        break;
      case 'dine':
          category = req.body['dine-category'];
        break;
    }


    var product = kit.models.product.build({
      type: type,
      model: model,
      picture: picture,
      description: description,
      parametrs: parametrs,
      images: images
    });

    if (req.files.picture && req.files.picture.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.picture.type) != -1) {
        var fileExt = path.extname(req.files.picture.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.picture.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        brand.picture = newFileName;
      }
    }

    brand.save(function(err, id) {
      if (err) {
        req.flash('brandError', err.toString());
        req.flash('form', req.body);
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/products');
    });
  },

 deleteProduct: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/brands');
      return;
    }

    kit.models.homeBox.delete({ contentId: id, type: 'brands' }, function() {
      kit.models.brand.delete({ id: id }, function() {
        res.redirect('/admin/products');
      });
    });
  },

  deleteProductPicture: function(req, res) {
    var id = parseInt(req.param('id'));

    if (isNaN(id)) {
      res.redirect('/admin/products');
      return;
    }

    kit.models.brand.update({ id: id }, { logo: '' } , function(err) {
      res.redirect('/admin/product/' + id);
    });
  },
  deleteProductImages: function(req, res) {
      var id   = parseInt(req.param('id'));

      if (isNaN(id)) {
          res.redirect('/admin/product');
          return;
      }

      kit.models.image.delete({ id: id }, function(err) {
          res.redirect(req.get('Referrer'));
      });
  },

  product: function(req, res) {
    var brandId = parseInt(req.param('id'));

    if (isNaN(brandId)) {
      res.redirect('/admin/products');
      return;
    }

    kit.models.brand.find({ where: { id: brandId } }, function(err, results) {
      if (results.length == 0) {
        res.redirect('/admin/products');
        return;
      }
      kit.models.image.find({where:{ entity: brandId, type:"product" }, order: ['image.order ASC'] }, function(err, images){
          if (err) {
              res.redirect('/admin/products');
              return;
          }
          res.render('admin/editProduct', { brand: results[0], images: images, moment: moment, errors: req.flash('brandError') || [] });
      });
    });
  },

  updateProduct: function(req, res) {
    var type = locales.encode(req.body.type)
      , model = locales.encode(req.body.model)
      , picture = locales.encode(req.body.picture)
      , description = req.body.description
      , parametrs = req.body.parametrs
      , images = req.body.images
      , id = req.param('id');



    switch(section) {
      case 'shop':
          category = req.body['shop-category'];
        break;
      case 'entertain':
          category = req.body['entertain-category'];
        break;
      case 'dine':
          category = req.body['dine-category'];
        break;
    }

    if (date.length != 0 && dateEnabled) {
      var d = moment(date);
      if (d.isValid()) {
        date = d.utc().valueOf();
      } else {
        date = 0;
      }
    } else {
      date = 0;
    }

    var brand = {
      type: type,
      model: model,
      picture: picture,
      description: description,
      parametrs: parametrs,
      images: images
    };

    if (req.files.logo && req.files.logo.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.logo.type) != -1) {
        var fileExt = path.extname(req.files.logo.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.logo.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);
        brand.logo = newFileName;
      }
    }

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);

        kit.models.image.build({
            file: newFileName,
            entity: id,
            type: 'product'
        }).save(function(err){});
      }
    }

    _.forEach(order, function(v, k) {
      k = parseInt(k.replace('id', ''));
      v = parseInt(v);

      if (isNaN(k) || isNaN(v)) return;

      kit.models.image.update({ id: k }, { order: v }, function() {});
    });

    kit.models.brand.update({ id: id }, brand, function(err) {
      if (err) {
        req.flash('brandError', err.toString());
        res.redirect(req.originalUrl);
        return
      }
      res.redirect('/admin/product');
    });
  },
// ############################################         SECTION        ######################################
  sections: function(req, res) {
    kit.models.section.find({}, function(err, results) {
      res.render('admin/sections', { sections: results });
    });
  },

  createSection: function(req, res) {
    var form = req.flash('form');

    res.render('admin/createSection', { errors: req.flash('sectionError') || [] ,
      form: form.length > 0 ? form[0] : {}});
  },

  createSectionSave: function(req, res) {
    var name = req.body.name
      , text = locales.encode(req.body.text);

    var section = kit.models.section.build({
      name: name,
      text: text
    });

    section.save(function(err, id) {
      if (err) {
        req.flash('sectionError', err.toString());
        req.flash('form', req.body);
        res.redirect(req.originalUrl);
        return;
      }
      res.redirect('/admin/section/' + id);
    });
  },

  deleteSection: function(req, res) {
    var id = parseInt(req.query.id);

    if (isNaN(id)) {
      res.redirect('/admin/sections');
      return;
    }

    kit.models.section.delete({ id: id }, function() {
      res.redirect('/admin/sections');
    });
  },

  editSection: function(req, res) {
    var sectionId = parseInt(req.param('id'));

    if (isNaN(sectionId)) {
      res.redirect('/admin/sections');
      return;
    }

    kit.models.section.find({ where: { id: sectionId } }, function(err, results) {
      if (results.length == 0) {
        res.redirect('/admin/sections');
        return;
      }
      kit.models.image.find({where:{ entity: sectionId, type:"section" }, order: ['image.order ASC'] }, function(err, images) {
        if (err) {
            res.redirect('/admin/sections');
            return;
        }
        res.render('admin/editSection', { section: results[0], images: images, moment: moment, errors: req.flash('sectionError') || [] });
      });
    });
  },

  editSectionSave: function(req, res) {
    var name = req.body.name
      , text = locales.encode(req.body.text)
      , order = req.body.order
      , id = req.param('id');

    if (isNaN(id)) {
      res.redirect('/admin/sections');
      return;
    }

    var section = {
      name: name,
      text: text
    };

    if (req.files.image && req.files.image.size > 0) {
      if (config.get('allowedImageTypes').indexOf(req.files.image.type) != -1) {
        var fileExt = path.extname(req.files.image.path);
        var newFileName = fileName() + fileExt;
        var is = fs.createReadStream(req.files.image.path);
        var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
        is.pipe(os);

        kit.models.image.build({
          file: newFileName,
          entity: id,
          type: 'section'
        }).save(function(err){});
      }
    }

    _.forEach(order, function(v, k) {
      k = parseInt(k.replace('id', ''));
      v = parseInt(v);

      if (isNaN(k) || isNaN(v)) return;

      kit.models.image.update({ id: k }, { order: v }, function() {});
    });

    kit.models.section.update({ id: id }, section, function(err) {
      if (err) {
        req.flash('sectionError', err.toString());
        res.redirect(req.originalUrl);
        return
      }
      res.redirect('/admin/section/' + id);
    });
  },

  // ####################################

  profile: function(req, res) {
    res.render('admin/profile', { user: req.user });
  },

  updateProfile: function(req, res) {
    var email     = req.body.email
      , firstName = req.body.firstName
      , lastName  = req.body.lastName
      , password  = req.body.password;

    if (!email.match(/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i)) {
      res.json({ status: 'failed', reason: 'Invalid e-mail address!' });
    }

    users.authUser({email: req.user.email, password: password}, function(err, user) {
      if (err) {
        res.json({ status: 'error', reason: 'Error occurred!' });
        return;
      }

      if (!user) {
        res.json({ status: 'failed', reason: 'Incorrect password!' });
        return;
      }

      users.updateUser({
        id: req.user.id,
        email: email,
        firstName: firstName,
        lastName: lastName
      }, function(err) {
        if (err) {
          res.json({ status: 'error', reason: 'Error occurred!' });
          return;
        }

        req.user.email = email;
        req.user.firstName = firstName;
        req.user.lastName = lastName;

        res.json({ status: 'ok', message: 'Profile updates saved.' });
      });
    });
  },

  changePassword: function(req, res) {
    var currentPassword = req.body.currentPassword
      , newPassword     = req.body.newPassword
      , repeatPassword  = req.body.repeatPassword;

    if (newPassword.length < 6) {
      res.json({ status: 'failed', reason: 'Short password!' });
      return;
    }

    if (newPassword !== repeatPassword) {
      res.json({ status: 'failed', reason: "Passwords don't match!" });
      return;
    }

    users.authUser({email: req.user.email, password: currentPassword}, function(err, user) {
      if (err) {
        res.json({ status: 'error', reason: 'Error occurred!' });
        return;
      }

      if (!user) {
        res.json({ status: 'failed', reason: 'Incorrect password!' });
        return;
      }

      users.updatePassword({
        id: req.user.id,
        password: newPassword
      }, function(err) {
        if (err) {
          res.json({ status: 'error', reason: 'Error occurred!' });
          return;
        }

        res.json({ status: 'ok', message: 'Password changed.' });
      });
    });
  }
};
