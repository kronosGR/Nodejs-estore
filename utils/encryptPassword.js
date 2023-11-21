const crypto = require('crypto');

module.exports = (password, salt) => {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, salt, 31000, 32, 'sha256', (error, key) => {
      error ? error(error) : res(key);
    });
  });
};
