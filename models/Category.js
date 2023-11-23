module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'Category',
    {
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
    Category.hasOne(models.Product, {
      foreignKey: { allowNull: false },
      onDelete: 'RESTRICT',
    });
  };

  return Category;
};
