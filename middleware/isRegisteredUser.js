const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

function isRegisteredUser(req, res, next) {
  const token = req.cookies.token || '';
  try {
    if (!token) return next(createHttpError(401, 'Unauthorized'));
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decodedToken.RoleId == 1 || decodedToken.RoleId == 2) next();
    else return next(createHttpError(401, 'Unauthorized'));
  } catch (err) {
    return next(createHttpError(401, 'Unauthorized'));
  }
}

module.exports = isRegisteredUser;
