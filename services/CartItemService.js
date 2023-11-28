class CartItemService {
  constructor(db) {
    this.CartItem = db.CartItem;
  }

  async addItemToCart(CartId, productId, quantity, unitPrice) {
    return await this.CartItem.create({
      productId: productId,
      quantity: quantity,
      unitPrice: unitPrice,
      CartId: CartId,
    }).catch((e) => e);
  }
  async getItemFromCart(productId, CartId) {
    return await this.CartItem.findOne({
      where: {
        CartId: CartId,
        productId: productId,
      },
    }).catch((e) => e);
  }

  async getItemsFromCart(cartId) {
    return await this.CartItem.findAll({
      where: {
        CartId: cartId,
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

  async deleteCartItem(cartItemId) {
    return await this.CartItem.destroy({
      where: { id: cartItemId },
    }).catch((e) => e);
  }
}

module.exports = CartItemService;
