const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  let token;
  if (req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }
  res.render('admin', { title: 'Admin Panel', token: token });
});

module.exports = router;
