class CartService {
  constructor(db) {
    this.Cart = db.Cart;
  }

  async addCart(userId) {
    return this.Cart.create({
      total: 0,
      UserId: userId,
    }).catch((e) => e);
  }

  async getCartIdForUser(userId) {}
}

module.exports = CartService;
