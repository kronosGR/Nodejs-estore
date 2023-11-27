class CartItemService {
  constructor(db) {
    this.CartItem = db.CartItem;
  }

  async addItemToCart(CartId, productId, quantity, unitPrice) {
    return this.CartItem.create({
      productId: productId,
      quantity: quantity,
      unitPrice: unitPrice,
      CartId: CartId,
    }).catch((e) => e);
  }
  async getItemFromCart(productId, CartId) {
    return this.CartItem.findOne({
      where: {
        CartId: CartId,
        productId: productId,
      },
    }).catch((e) => e);
  }

  async updateItemInCart(CartId, productId, quantity, unitPrice) {
    return await this.CartItem.update(
      {
        quantity: quantity,
        unitPrice: unitPrice,
      },
      {
        where: {
          CartId: CartId,
          productId: productId,
        },
        returning: true,
        plain: true,
      }
    );
  }

  async deleteCartItem(CartId, productId) {
    return await this.CartItem.destroy({
      where: { productId: productId, CartId: CartId },
    }).catch((e) => e);
  }
}

module.exports = CartItemService;
