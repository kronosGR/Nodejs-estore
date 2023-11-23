var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jsend = require('jsend');
const bodyParser = require('body-parser');
require('dotenv').config();

const isAdmin = require('./middleware/isAdmin');

const db = require('./models');

const initRouter = require('./routes/init');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const brandsRouter = require('./routes/brands');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(jsend.middleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));

app.use('/', indexRouter);
app.use('/init', initRouter);
app.use('/auth', authRouter);
app.use('/admin', isAdmin, adminRouter);
app.use('/brands', brandsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json(jsend.fail({ statusCode: err.status, data: err.message }));
});

module.exports = app;
