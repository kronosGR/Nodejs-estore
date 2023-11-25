const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('admin');
});

router.get('/brands', (req, res, next) => {
  res.render('admin-brands');
});

router.get('/categories', (req, res, next) => {
  res.render('admin-categories');
});

router.get('/roles', (req, res, next) => {
  res.render('admin-roles');
});

router.get('/memberships', (req, res, next) => {
  res.render('admin-memberships');
});

router.get('/users', (req, res, next) => {
  res.render('admin-users');
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
