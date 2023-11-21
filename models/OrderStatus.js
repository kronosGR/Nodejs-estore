module.exports = (sequelize, Sequelize) => {
  const OrderStatus = sequelize.define(
    'OrderStatus',
    {
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: {
          args: 'name',
          msg: 'orderstatus already exists',
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  OrderStatus.associate = function (models) {
    OrderStatus.hasOne(models.Order, { foreignKey: { allowNull: false } });
  };

  return OrderStatus;
};
