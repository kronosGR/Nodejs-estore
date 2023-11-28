const { Sequelize } = require('sequelize');

class OrderService {
  constructor(db) {
    this.Order = db.Order;
  }

  async addOrder(orderId, UserId, total, cartId, OrderStatusId) {
    const order = await this.Order.create({
      id: orderId,
      total: total,
      cartId: cartId,
      OrderStatusId: OrderStatusId,
      UserId: UserId,
    }).catch((e) => e);
    return order.id;
  }
}

module.exports = OrderService;
