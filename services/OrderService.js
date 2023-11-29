const { Sequelize } = require('sequelize');

class OrderService {
  constructor(db) {
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
    this.OrderStatus = db.OrderStatus;
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
      include: [this.OrderItem, this.OrderStatus],
    }).catch((e) => e);
  }

  async getAllOrdersForUser(userId) {
    return await this.Order.findAll({
      where: { UserId: userId },
      include: [this.OrderItem],
    }).catch((e) => e);
  }

  async changeOrderStatus(orderId, orderStatusId) {
    return await this.Order.update(
      {
        OrderStatusId: orderStatusId,
      },
      {
        where: {
          id: orderId,
        },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = OrderService;
