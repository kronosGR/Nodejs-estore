module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: {
          args: 'username',
          msg: 'username already exists',
        },
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: {
          args: 'email',
          msg: 'email already exists',
        },
      },
      encryptedPassword: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },
      salt: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      telephone: {
        type: Sequelize.DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Order, { foreignKey: { allowNull: false } });
    User.hasMany(models.Cart, { foreignKey: { allowNull: false } });
    User.belongsTo(models.Role, { foreignKey: { allowNull: false } });
    User.belongsTo(models.Membership, { foreignKey: { allowNull: false } });
  };

  return User;
};
