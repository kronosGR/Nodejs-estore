module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      productId: Sequelize.INTEGER,
      quantity: Sequelize.DataTypes.INTEGER,
      unitPrice: Sequelize.DataTypes.FLOAT,
    },
    { timestamps: true }
  );

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: { type: Sequelize.DataTypes.UUID },
    });
  };

  return OrderItem;
};
