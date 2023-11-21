class BrandService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Brand = db.Brand;
  }

  async addBrand(name) {
    return this.Brand.create({
      name: name,
    }).catch((e) => e);
  }

  async getBrandIdByName(name) {
    const queryString = `SELECT id from brands where name='${name}'`;
    return this.sequelize.query(queryString, { type: this.sequelize.QueryTypes.SELECT });
  }
}

module.exports = BrandService;
