module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    total: Sequelize.DataTypes.FLOAT,
  });

  Order.associate = function (models) {
    Order.hasMany(models.OrderItem, { foreignKey: { allowNull: false } });
    Order.belongsTo(models.OrderStatus, { foreignKey: { allowNull: false } });
    Order.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Order;
};
