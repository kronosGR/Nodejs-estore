const encryptPassword = require('../utils/encryptPassword');
const crypto = require('crypto');

class UserService {
  constructor(db) {
    this.User = db.User;
  }

  async addUser(
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    telephone,
    MembershipId,
    RoleId
  ) {
    const salt = crypto.randomBytes(16);
    const encryptedPassword = await encryptPassword(password, salt);

    return this.User.create({
      firstName,
      lastName,
      username,
      email,
      encryptedPassword,
      salt,
      address,
      telephone,
      MembershipId,
      RoleId,
    }).catch((e) => {
      return e;
    });
  }
}

module.exports = UserService;
