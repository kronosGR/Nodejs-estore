const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('admin', { title: 'Admin Panel' });
});

router.get('/brands', (req, res, next) => {
  res.render('admin-brands');
});

router.get('/categories', (req, res, next) => {
  res.render('admin-categories');
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
