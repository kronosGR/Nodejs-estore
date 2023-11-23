const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  console.log(req.cookies.token);
  res.render('admin', { title: 'Admin Panel' });
});

router.get('/brands', async (req, res, next) => {
  res.render('admin-brands');
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
