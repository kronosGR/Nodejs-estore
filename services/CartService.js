class CartService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Cart = db.Cart;
    this.CartItem = db.CartItem;
  }

  async addCart(userId, total, isCheckedOut) {
    return this.Cart.create({
      total: total,
      UserId: userId,
      isCheckedOut: isCheckedOut,
    }).catch((e) => e);
  }

  async getCartsForUser(userId) {
    return this.Cart.findAll({
      where: { UserId: userId },
      include: [this.CartItem],
    }).catch((e) => e);
  }

  async getCartForUser(userId, cartId) {
    return this.Cart.findOne({
      where: { UserId: userId, id: cartId },
      include: [this.CartItem],
    }).catch((e) => e);
  }

  async deleteCart(cartId) {
    await this.Cart.destror({
      where: { id: cartId },
    }).catch((e) => e);
  }

  async updateCartForUser(cartId, total, isCheckedOut) {
    return this.Cart.update(
      {
        total: total,
        isCheckedOut: isCheckedOut,
      },
      { where: { id: cartId }, returning: true, plain: true }
    ).catch((e) => e);
  }
}

module.exports = CartService;
