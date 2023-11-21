class RoleService {
  constructor(db) {
    this.Role = db.Role;
  }

  async addRole(name) {
    return await this.Role.create({
      name: name,
    }).catch((e) => e);
  }

  async getRoles() {
    return await this.Role.findAll();
  }

  async getRole(id) {
    return await this.Role.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async deleteRole(id) {
    return await this.Role.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateRole(id, name) {
    return await this.Role.update(
      {
        name: name,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    );
  }
}

module.exports = RoleService;
