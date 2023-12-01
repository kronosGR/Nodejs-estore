class ProductService {
  constructor(db) {
    this.Product = db.Product;
    this.sequelize = db.sequelize;
    this.Category = db.Category;
    this.Brand = db.Brand;
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
    const product = await this.Product.create({
      name,
      imgUrl,
      description,
      price,
      quantity,
      isDeleted,
      BrandId,
      CategoryId,
    }).catch((e) => e);
    return product;
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

  async getProduct(productId) {
    const product = await this.Product.findOne({
      where: { id: productId },
      include: [this.Category, this.Brand],
    });
    return product;
  }

  async updateProductQuantity(productId, quantity) {
    return await this.Product.update(
      {
        quantity: quantity,
      },
      {
        where: { id: productId },
        returning: true,
        plain: true,
      }
    );
  }

  async updateProduct(
    id,
    name,
    imgUrl,
    description,
    price,
    quantity,
    isDeleted,
    BrandId,
    CategoryId
  ) {
    return await this.Product.update(
      {
        name,
        imgUrl,
        description,
        price,
        quantity,
        isDeleted,
        BrandId,
        CategoryId,
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
