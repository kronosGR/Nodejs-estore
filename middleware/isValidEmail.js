const createHttpError = require('http-errors');

function isValidEmail(req, res, next) {
  const email = req.body.email;

  const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(reg)) {
    next();
  } else {
    next(createHttpError(400, 'Not a valid email address'));
  }
}

module.exports = isValidEmail;
