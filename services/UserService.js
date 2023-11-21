const encryptPassword = require('../utils/encryptPassword');
const crypto = require('crypto');

class UserService {
  constructor(db) {
    this.User = db.User;
  }

  async getUserById(email) {
    return await this.User.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async getUserByEmail(email) {
    return await this.User.findOne({
      where: { email: email },
    }).catch((e) => e);
  }

  async getUserByUsername(username) {
    return await this.User.findOne({
      where: {
        username: username,
      },
    }).catch((e) => e);
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

  async deleteUser(id) {
    return await this.User.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateUser(user) {
    const {
      id,
      firstName,
      lastName,
      username,
      email,
      address,
      telephone,
      itemPurchased,
      MembershipId,
      RoleId,
    } = user;

    return await this.User.update(
      {
        firstName,
        lastName,
        username,
        email,
        address,
        telephone,
        itemPurchased,
        MembershipId,
        RoleId,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = UserService;
