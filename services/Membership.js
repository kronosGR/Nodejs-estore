class MembershipService {
  constructor(db) {
    this.Membership = db.Membership;
  }

  async addMembership(name, from, to, discount) {
    return this.Membership.create({
      name: name,
      from: from,
      to: to,
      discount: discount,
    }).catch((e) => e);
  }

  async getMemberships() {
    return await this.Membership.findAll();
  }

  async getMembership(id) {
    return await this.Membership.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async deleteMembership(id) {
    return await this.Membership.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateMembership(id, name, from, to, discount) {
    return await this.Membership.update(
      {
        name: name,
        from: from,
        to: to,
        discount: discount,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = MembershipService;
