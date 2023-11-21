module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  Product.associate = function (models) {
    Product.belongsTo(models.Category, { foreignKey: { allowNull: false } });
    Product.belongsTo(models.Brand, { foreignKey: { allowNull: false } });
  };

  return Product;
};
