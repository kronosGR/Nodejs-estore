const express = require('express');

const db = require('../models');
const BrandService = require('../services/BrandService');

const router = express.Router();
const brandService = new BrandService(db);

router.get('/', async (req, res, next) => {
  console.log(req.cookies.token);
  res.render('admin', { title: 'Admin Panel' });
});

router.get('/brands', async (req, res, next) => {
  console.log(req.body);
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
