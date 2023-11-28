const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (req) => {
  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  return decodedToken.id;
};
