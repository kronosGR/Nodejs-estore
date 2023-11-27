class ProductService {
  constructor(db) {
    this.Product = db.Product;
    this.sequelize = db.sequelize;
  }

  async addProduct(
    name,
    imgUrl,
    description,
    price,
    quantity,
    isDeleted,
    BrandId,
    CategoryId
  ) {
    return this.Product.create({
      name,
      imgUrl,
      description,
      price,
      quantity,
      isDeleted,
      BrandId,
      CategoryId,
    }).catch((e) => e);
  }

  async getProducts(whereClause) {
    const queryString = `
    SELECT products.id,products.name,imgUrl,description,price,quantity,isDeleted,
    products.createdAt,products.updatedAt,BrandId, brands.name as brandName,CategoryId,
     categories.name as categoryName FROM products inner join categories on
      products.CategoryId=categories.id inner join brands on 
      products.BrandId = brands.id ${whereClause} order by products.id
    `;

    return await this.sequelize.query(queryString, {
      type: this.sequelize.QueryTypes.SELECT,
    });
  }

  async deleteProduct(id) {
    return await this.Product.update(
      {
        isDeleted: 1,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = ProductService;
