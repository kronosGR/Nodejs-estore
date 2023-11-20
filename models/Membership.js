module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define(
    'Membership',
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
          msg: 'membership already exists',
        },
        from: Sequelize.DataTypes.INTEGER,
        to: Sequelize.DataTypes.INTEGER,
        discount: Sequelize.DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );

  Membership.associate = function (models) {
    Membership.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Membership;
};
