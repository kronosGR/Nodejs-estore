class MembershipService {
  constructor(db) {
    this.sequelize = db.sequelize;
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

  async getMembershipWithItemsPurchased(amount) {
    const queryString = `SELECT m.id, m.name, m.from, m.to, m.discount FROM memberships as m WHERE ${amount} BETWEEN m.from and m.to`;
    return this.sequelize.query(queryString, {
      type: this.sequelize.QueryTypes.SELECT,
    });
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
