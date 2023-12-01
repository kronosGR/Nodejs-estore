class CategoryService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Category = db.Category;
  }

  async addCategory(name) {
    const category = await this.Category.create({
      name: name,
    }).catch((e) => e);
    return category;
  }

  async getCategoryIdByName(name) {
    const queryString = `SELECT id from categories where name='${name}'`;
    return await this.sequelize.query(queryString, {
      type: this.sequelize.QueryTypes.SELECT,
    });
  }

  async getAllCategories() {
    return await this.Category.findAll();
  }

  async getCategory(id) {
    return await this.Category.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async deleteCategory(id) {
    return await this.Category.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateCategory(id, name) {
    return await this.Category.update(
      {
        name: name,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = CategoryService;
