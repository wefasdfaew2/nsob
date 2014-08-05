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
        res.render('account/index');
    },

    // ####################################

    ads: function(req, res) {
        kit.models.ad.find({}, function(err, results) {
            res.render('account/ads', { ads: results });
        });
    },
    adsCreateView: function(req, res) {
        var form = req.flash('form');

        res.render('account/createAd', { errors: req.flash('brandError') || [] ,
            form: form.length > 0 ? form[0] : {}});
    },
    adsCreate: function(req, res) {
        console.log("xuy");
        console.log(req.body);
//        var name = locales.encode(req.body.name)
//            , titleLine = locales.encode(req.body.titleLine)
//            , text = locales.encode(req.body.text)
//            , date = req.body.date
//            , dateEnabled = req.body.dateEnabled
//            , section = req.body.section
//            , category = ''
//            , room = req.body.room || ''
//            , floor = req.body.floor || '';

        var cardrooms = locales.encode(req.body.card_rooms)
            ,cardaddress = locales.encode(req.body.card_address)
            ,dom = locales.encode(req.body.dom)
            ,korpus = locales.encode(req.body.korpus)
            ,stroenie = locales.encode(req.body.stroenie)
            ,fdataMetroIdh = locales.encode(req.body.fdataMetroId_h)
            ,farval = locales.encode(req.body.fdataMetroId_h)
            ,levels = locales.encode(req.body.levels)
            ,fullevel = locales.encode(req.body.fullevel)
            ,general = locales.encode(req.body.general)
            ,residential =locales.encode(req.body.residential)
            ,kitchen = locales.encode(req.body.kitchen)
            ,squarerooms =locales.encode(req.body.square_rooms)
            ,lasttransaction = req.body.lasttransaction
            ,notes = locales.encode(req.body.notes)
            ,phone = locales.encode(req.body.phone)
            ,afoot = ''
            ,newEnabled = ''
            ,sale = ''
            ,ops = '';



//        switch(section) {
//            case 'shop':
//                category = req.body['shop-category'];
//                break;
//            case 'entertain':
//                category = req.body['entertain-category'];
//                break;
//            case 'dine':
//                category = req.body['dine-category'];
//                break;
//        }

//        if (date.length != 0 && dateEnabled) {
//            var d = moment(date);
//            if (d.isValid()) {
//                date = d.utc().valueOf();
//            } else {
//                date = 0;
//            }
//        } else {
//            date = 0;
//        }

        var ad = kit.models.ad.build({
            cardrooms: cardrooms,
            cardaddress: cardaddress,
            dom: dom,
            korpus: korpus,
            stroenie: stroenie,
            fdataMetroIdh: fdataMetroIdh,
            farval: farval,
            levels: levels,
            fullevel: fullevel,
            general: general,
            residential: residential,
            kitchen: kitchen,
            squarerooms: squarerooms,
            lasttransaction: lasttransaction,
            notes: notes,
            phone: phone,
            afoot: afoot,
            newEnabled: newEnabled,
            sale: sale,
            ops: ops

        });

        if (req.files.logo && req.files.logo.size > 0) {
            if (config.get('allowedImageTypes').indexOf(req.files.logo.type) != -1) {
                var fileExt = path.extname(req.files.logo.path);
                var newFileName = fileName() + fileExt;
                var is = fs.createReadStream(req.files.logo.path);
                var os = fs.createWriteStream(config.get('path').uploads + "/" + newFileName);
                is.pipe(os);
                ad.logo = newFileName;
            }
        }

        ad.save(function(err, id) {
            if (err) {
                req.flash('adError', err.toString());
                req.flash('form', req.body);
                res.redirect(req.originalUrl);
                return;
            }
            res.redirect('/account/ads');
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
