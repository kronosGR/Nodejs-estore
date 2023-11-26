const createHttpError = require('http-errors');

function isValidUrl(req, res, next) {
  const imgUrl = req.body.imgUrl;

  const reg =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if (imgUrl.match(reg)) {
    next();
  } else {
    next(createHttpError(400, 'Not a valid url address'));
  }
}

module.exports = isValidUrl;
