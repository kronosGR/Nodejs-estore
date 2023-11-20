module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    'Role',
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
    Role.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Role;
};
