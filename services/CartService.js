class CartService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Cart = db.Cart;
    this.CartItem = db.CartItem;
  }

  async addCart(userId) {
    return this.Cart.create({
      total: 0,
      UserId: userId,
    }).catch((e) => e);
  }

  async getCartIdForUser(userId) {
    return this.Cart.findOne({
      where: { UserId: userId },
    }).catch((e) => e);
  }

  async getCartForUser(userId) {
    return this.Cart.findOne({
      where: { UserId: userId },
      include: [this.CartItem],
    }).catch((e) => e);
  }

  async updateCartForUser(cartId, total) {
    return this.Cart.update(
      {
        total: total,
      },
      { where: { id: cartId }, returning: true, plain: true }
    ).catch((e) => e);
  }
}

module.exports = CartService;
