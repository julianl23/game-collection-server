const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      admin: DataTypes.BOOLEAN
    },
    {}
  );

  // User.associate = function(models) {
  User.associate = () => {
    // associations can be defined here
  };

  return User;
};

export default UserModel;
