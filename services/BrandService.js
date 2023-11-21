class BrandService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Brand = db.Brand;
  }

  async addBrand(name) {
    return await this.Brand.create({
      name: name,
    }).catch((e) => e);
  }

  async getBrandIdByName(name) {
    const queryString = `SELECT id from brands where name='${name}'`;
    return await this.sequelize.query(queryString, {
      type: this.sequelize.QueryTypes.SELECT,
    });
  }
  async getAllBrands() {
    return await this.Brand.findAll();
  }

  async getBrand(id) {
    return await this.Brand.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async deleteBrand(id) {
    return await this.Brand.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateBrand(id, name) {
    return await this.Brand.update(
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

module.exports = BrandService;
