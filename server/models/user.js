const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  }

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // 0 可用 1 注销
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
