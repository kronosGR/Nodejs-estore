module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: Sequelize.DataTypes.UUID, primaryKey: true },
    total: Sequelize.DataTypes.FLOAT,
  });

  Order.associate = function (models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: { type: Sequelize.DataTypes.UUID },
    });
    Order.belongsTo(models.OrderStatus, { foreignKey: { allowNull: false } });
    Order.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Order;
};
