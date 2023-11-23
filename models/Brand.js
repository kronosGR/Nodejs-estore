module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define(
    'Brand',
    {
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
    Brand.hasOne(models.Product, {
      foreignKey: { allowNull: false },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return Brand;
};
