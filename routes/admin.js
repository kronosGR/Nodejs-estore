const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Products"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin');
});

router.get('/brands', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Brands"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-brands');
});

router.get('/categories', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Categories"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-categories');
});

router.get('/roles', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Roles"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-roles');
});

router.get('/memberships', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Memberships"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-memberships');
});

router.get('/users', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Users"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-users');
});

router.get('/orders', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Orders"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('admin-orders');
});

router.get('/logout', (req, res, next) => {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Admin Panel Logout"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
