class ProductService {
  constructor(db) {
    this.Product = db.Product;
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
}

module.exports = ProductService;
