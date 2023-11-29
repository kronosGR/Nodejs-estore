const { Sequelize } = require('sequelize');

class OrderService {
  constructor(db) {
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
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

  async getAllOrders() {
    return await this.Order.findAll({
      include: [this.OrderItem],
    }).catch((e) => e);
  }
}

module.exports = OrderService;
