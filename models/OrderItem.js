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
    OrderItem.belongsTo(models.Order, { foreignKey: { allowNull: false } });
    OrderItem.hasOne(models.Product, { foreignKey: { allowNull: false } });
  };

  return OrderItem;
};
