const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncomeList extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      // 该表属于用户
      IncomeList.belongsTo(models.User);
    }
  }

  IncomeList.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
      allowNull: false,
    },
    // 日期
    date: {
      type: DataTypes.DATE, // 时间格式是ISO 8601格式的时间字符串
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 金额
    amount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false
    },
    // 备注
    remark: {
      type: DataTypes.STRING,
    },
    // 是否到账
    isReceived: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 未到账 1 已到账
      allowNull: false
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 在用 1 删除
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'IncomeList',
  });
  return IncomeList;
};
