const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const isBrowser = require('../utils/isBrowser');

require('dotenv').config();

function isAdmin(req, res, next) {
  let web;
  let token;
  token = req.cookies.token || '';
  if (req.headers['user-agent']) {
    isWeb = isBrowser(req.headers['user-agent']);
  } else {
    token = req.headers.authorization.substring(7, req.headers.authorization.length);
  }
  let isValid = true;
  try {
    if (!token) isValid = false;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodedToken.RoleId != 1) isValid = false;
    console.log(decodedToken.RoleId);
  } catch (err) {
    isValid = false;
  }

  if (isValid) {
    return next();
  } else {
    if (isWeb) {
      return res.redirect('/');
    } else {
      return next(createHttpError(401, 'Unauthorized'));
    }
  }
}

module.exports = isAdmin;
