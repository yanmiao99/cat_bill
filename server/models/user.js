const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
    },
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
