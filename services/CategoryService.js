class CategoryService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Category = db.Category;
  }

  async addCategory(name) {
    return this.Category.create({
      name: name,
    }).catch((e) => e);
  }

  async getCategoryIdByName(name) {
    const queryString = `SELECT id from categories where name='${name}'`;
    return this.sequelize.query(queryString, {
      type: this.sequelize.QueryTypes.SELECT,
    });
  }
}

module.exports = CategoryService;
