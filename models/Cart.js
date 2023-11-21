module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {
      total: Sequelize.DataTypes.FLOAT,
    },
    { timestamps: true }
  );

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, { foreignKey: { allowNull: false } });
    Cart.hasMany(models.CartItem, { foreignKey: { allowNull: false } });
  };

  return Cart;
};
