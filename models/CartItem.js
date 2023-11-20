module.exports = (sequelize, Sequelize) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      quantity: Sequelize.DataTypes.INTEGER,
      unitPrice: Sequelize.DataTypes.FLOAT,
    },
    { timestamps: true }
  );

  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart, { foreignKey: { allowNull: false } });
    CartItem.hasOne(models.Product, { foreignKey: { allowNull: false } });
  };

  return CartItem;
};
