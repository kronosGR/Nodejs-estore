class OrderItemService {
  constructor(db) {
    this.OrderItem = db.OrderItem;
  }

  async addItemToOrder(OrderId, productId, quantity, unitPrice) {
    return await this.OrderItem.create({
      productId: productId,
      quantity: quantity,
      unitPrice: unitPrice,
      OrderId: OrderId,
    }).catch((e) => e);
  }
  async getItemFromOrder(productId, OrderId) {
    return await this.OrderItem.findOne({
      where: {
        id: OrderId,
        productId: productId,
      },
    }).catch((e) => e);
  }

  async getItemsFromOrder(OrderId) {
    return await this.OrderItem.findAll({
      where: {
        OrderId: OrderId,
      },
    }).catch((e) => e);
  }

  async updateItemInOrder(OrderId, productId, quantity, unitPrice) {
    return await this.OrderItem.update(
      {
        quantity: quantity,
        unitPrice: unitPrice,
      },
      {
        where: {
          OrderId: OrderId,
          productId: productId,
        },
        returning: true,
        plain: true,
      }
    );
  }
}

module.exports = OrderItemService;
