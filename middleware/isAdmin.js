const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

function isAdmin(req, res, next) {
  const token = req.cookies.token || '';
  try {
    if (!token) return res.redirect('/');
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodedToken.RoleId != 1) return res.redirect('/');
    next();
  } catch (err) {
    return res.redirect('/');
  }
}

module.exports = isAdmin;
