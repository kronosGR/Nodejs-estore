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
}

module.exports = MembershipService;
