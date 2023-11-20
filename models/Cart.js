module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      total: Sequelize.DataTypes.FLOAT,
    },
    { timestamps: true }
  );

  Cart.associate = function (models) {
    Cart.belongsTo(model.User, { foreignKey: { allowNull: false } });
    Cart.hasMany(model.CartItem, { foreignKey: { allowNull: false } });
  };

  return Cart;
};
