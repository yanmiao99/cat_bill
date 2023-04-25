const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // 定义类方法 (一对多关系)
    static associate(models) {
      User.hasMany(models.LendPeople);
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,              // 是否唯一
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 可用 1 注销
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
