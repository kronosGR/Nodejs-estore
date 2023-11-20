module.exports = (sequelize, Sequelize) => {
  const OrderStatus = sequelize.defile(
    'OrderStatus',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    OrderStatus.belongsTo(models.Order, { foreignKey: { allowNull: false } });
  };

  return OrderStatus;
};
