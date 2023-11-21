module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: {
          args: 'name',
          msg: 'role already exists',
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Role.associate = function (models) {
    Role.hasOne(models.User, { foreignKey: { allowNull: false } });
  };

  return Role;
};
