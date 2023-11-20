module.exports = (sequelize, Sequelize) => {
  const Order = define('Order', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: Sequelize.DataTypes.FLOAT,
  });

  Order.associate = function (models) {
    Order.hasMany(models.OderItem, { foreignKey: { allowNull: false } });
    Order.hasOne(models.OrderStatus, { foreignKey: { allowNull: false } });
    Order.belongTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Order;
};
