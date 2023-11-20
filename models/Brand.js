module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define(
    'Brand',
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
          msg: 'brand already exists',
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Brand.associate = function (models) {
    Brand.belongsTo(models.Product, { foreignKey: { allowNull: false } });
  };
  return Brand;
};
