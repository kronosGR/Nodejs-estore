const encryptPassword = require('../utils/encryptPassword');
const crypto = require('crypto');

class UserService {
  constructor(db) {
    this.User = db.User;
    this.Role = db.Role;
    this.Membership = db.Membership;
  }

  async getUsers() {
    return await this.User.findAll({ include: [this.Role, this.Membership] });
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
    itemsPurchased,
    MembershipId,
    RoleId
  ) {
    const salt = crypto.randomBytes(16);
    const encryptedPassword = await encryptPassword(password, salt);

    return this.User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      encryptedPassword: encryptedPassword,
      salt: salt,
      address: address,
      telephone: telephone,
      itemsPurchased: itemsPurchased,
      MembershipId: MembershipId,
      RoleId: RoleId,
    }).catch((e) => {
      return e;
    });
  }

  async deleteUser(id) {
    return await this.User.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateUser(
    id,
    firstName,
    lastName,
    username,
    email,
    address,
    telephone,
    itemsPurchased,
    MembershipId,
    RoleId
  ) {
    return await this.User.update(
      {
        firstName,
        lastName,
        username,
        email,
        address,
        telephone,
        itemsPurchased,
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

  async getUserDiscount(userId) {
    const user = await this.User.findOne({
      where: { id: userId },
      include: this.Membership,
    });
    return user.Membership;
  }

  async getItemsPurchased(userId) {
    const user = await this.User.findOne({
      where: { id: userId },
    });
    return user.itemsPurchased;
  }
}

module.exports = UserService;
