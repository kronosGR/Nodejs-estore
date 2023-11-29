var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // #swagger.tags=['Admin Front-End']
  // #swagger.description = "Login page for Administrators"
  // #swagger.produces = ['text/html']
  // #swagger.responses=[200]
  res.render('index', { title: 'Admin Panel' });
});

module.exports = router;
