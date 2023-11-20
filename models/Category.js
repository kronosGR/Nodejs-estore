module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'Category',
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
          msg: 'category already exists',
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Category.associate = function (models) {
    Category.belongsTo(models.Product, { foreignKey: { allowNull: false } });
  };

  return Category;
};
