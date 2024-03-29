module.exports = (sequelize, Sequelize) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      productId: Sequelize.INTEGER,
      quantity: Sequelize.DataTypes.INTEGER,
      unitPrice: Sequelize.DataTypes.FLOAT,
    },
    { timestamps: true }
  );

  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart, { foreignKey: { allowNull: false } });
  };

  return CartItem;
};
