module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: Sequelize.DataTypes.CHAR(8),
      primaryKey: true,
    },
    total: Sequelize.DataTypes.FLOAT,
    cartId: Sequelize.DataTypes.INTEGER,
  });

  Order.associate = function (models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: { type: Sequelize.DataTypes.CHAR(8) },
    });
    Order.belongsTo(models.OrderStatus, { foreignKey: { allowNull: false } });
    Order.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Order;
};
