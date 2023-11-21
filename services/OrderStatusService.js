class OrderStatusService {
  constructor(db) {
    this.OrderStatus = db.OrderStatus;
  }

  async addOrderStatus(name) {
    return await this.OrderStatus.create({
      name: name,
    }).catch((e) => e);
  }

  async getAllOrderStatus() {
    return await this.OrderStatus.findAll();
  }

  async getOrderStatus(id) {
    return await this.OrderStatus.findOne({
      where: { id: id },
    }).catch((e) => e);
  }

  async deleteOrderStatus(id) {
    return await this.OrderStatus.destroy({
      where: { id: id },
    }).catch((e) => e);
  }

  async updateOrderStatus(id, name) {
    return await this.OrderStatus.update(
      {
        name: name,
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    ).catch((e) => e);
  }
}

module.exports = OrderStatusService;
