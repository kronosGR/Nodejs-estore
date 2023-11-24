module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define(
    'Membership',
    {
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: {
          args: 'name',
          msg: 'membership already exists',
        },
      },
      from: Sequelize.DataTypes.INTEGER,
      to: Sequelize.DataTypes.INTEGER,
      discount: Sequelize.DataTypes.INTEGER,
    },
    {
      timestamps: true,
    }
  );

  Membership.associate = function (models) {
    Membership.hasOne(models.User, {
      foreignKey: { allowNull: false },
      onDelete: 'RESTRICT',
    });
  };

  return Membership;
};
