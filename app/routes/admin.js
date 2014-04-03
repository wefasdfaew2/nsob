"use strict";

var auth = require(global.config.get('path').lib + '/auth')
  , config = global.config
  , express = require('express');

module.exports.bind = function(routes, controllers) {

  routes.add({
    uri: '/admin*',
    method: 'all',
    func: auth.requireAuthentication
  });

  routes.add({
    uri: '/admin',
    func: controllers.admin.index
  });

  routes.add({
    uri: '/admin/brands',
    func: controllers.admin.brands
  });

  routes.add({
    uri: '/admin/brand/delete-logo/:id',
    func: controllers.admin.deleteBrandLogo
  });

  routes.add({
    uri: '/admin/brand/delete',
    func: controllers.admin.deleteBrand
  });

  routes.add({
    uri: '/admin/brand/:id',
    func: controllers.admin.brand
  });

  routes.add({
    uri: '/admin/brand/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.updateBrand
  });

  routes.add({
    uri: '/admin/brands/create',
    func: controllers.admin.brandsCreateView
  });

  routes.add({
    uri: '/admin/brands/create',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.brandsCreate
  });

  routes.add({
    uri: '/admin/homepage',
    func: controllers.admin.homepage
  });

  routes.add({
    uri: '/admin/homeboxes/create',
    func: controllers.admin.createHomebox
  });

  routes.add({
    uri: '/admin/homeboxes/create',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.createHomeboxSave
  });

  routes.add({
    uri: '/admin/homeboxes/edit/:id',
    func: controllers.admin.editHomebox
  });

  routes.add({
    uri: '/admin/homeboxes/edit/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.editHomeboxSave
  });

  routes.add({
    uri: '/admin/homeboxes/delete',
    func: controllers.admin.deleteHomebox
  });

  routes.add({
    uri: '/admin/homeboxes/delete-image/:id',
    func: controllers.admin.deleteHomeboxImage
  });

  routes.add({
    uri: '/admin/events',
    func: controllers.admin.events
  });

  routes.add({
    uri: '/admin/events/create',
    func: controllers.admin.createEvent
  });

  routes.add({
    uri: '/admin/events/create',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.createEventSave
  });

  routes.add({
    uri: '/admin/events/edit/:id',
    func: controllers.admin.editEvent
  });

  routes.add({
    uri: '/admin/events/edit/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.editEventSave
  });

  routes.add({
    uri: '/admin/events/delete',
    func: controllers.admin.deleteEvent
  });

  routes.add({
    uri: '/admin/event/delete-image/:id',
    func: controllers.admin.deleteEventImage
  });

  routes.add({
    uri: '/admin/news',
    func: controllers.admin.news
  });

  routes.add({
    uri: '/admin/news/create',
    func: controllers.admin.createNews
  });

  routes.add({
    uri: '/admin/news/create',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.createNewsSave
  });

  routes.add({
    uri: '/admin/news/edit/:id',
    func: controllers.admin.editNews
  });

  routes.add({
    uri: '/admin/news/edit/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.editNewsSave
  });

  routes.add({
    uri: '/admin/news/delete',
    func: controllers.admin.deleteNews
  });

  routes.add({
    uri: '/admin/news/delete-image/:id',
    func: controllers.admin.deleteNewsImage
  });

  routes.add({
    uri: '/admin/profile',
    func: controllers.admin.profile
  });

  routes.add({
    uri: '/admin/profile',
    method: 'post',
    func: controllers.admin.updateProfile
  });

  routes.add({
    uri: '/admin/profile/password',
    method: 'post',
    func: controllers.admin.changePassword
  });

  routes.add({
    uri: '/admin/delete-image/:id',
    func: controllers.admin.deleteImage
  });

  routes.add({
    uri: '/admin/sections',
    func: controllers.admin.sections
  });

  routes.add({
    uri: '/admin/section/create',
    func: controllers.admin.createSection
  });

  routes.add({
    uri: '/admin/section/create',
    method: 'post',
    func: controllers.admin.createSectionSave
  });

  routes.add({
    uri: '/admin/section/delete',
    func: controllers.admin.deleteSection
  });

  routes.add({
    uri: '/admin/section/:id',
    func: controllers.admin.editSection
  });

  routes.add({
    uri: '/admin/section/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.editSectionSave
  });


// ########### ########### ########### ########### ########### ########### ########### ########### ###########  
    routes.add({
    uri: '/admin/products',
    func: controllers.admin.products
  });

  routes.add({
    uri: '/admin/product/delete-logo/:id',
    func: controllers.admin.deleteBrandLogo
  }); 

  routes.add({
    uri: '/admin/product/delete',
    func: controllers.admin.deleteBrand
  });

  routes.add({
    uri: '/admin/product/:id',
    func: controllers.admin.product
  });

  routes.add({
    uri: '/admin/product/:id',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.updateProduct
  });

  routes.add({
    uri: '/admin/products/create',
    func: controllers.admin.productsCreateView
  });

  routes.add({
    uri: '/admin/products/create',
    method: 'post',
    fileUpload: true,
    func: controllers.admin.productsCreate
  });
};
