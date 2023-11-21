class RoleService {
  constructor(db) {
    this.Role = db.Role;
  }

  async addRole(name) {
    return this.Role.create({
      name: name,
    }).catch((e) => e);
  }
}

module.exports = RoleService;
