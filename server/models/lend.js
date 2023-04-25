const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lend extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      Lend.belongsTo(models.LendPeople);
    }
  }

  Lend.init({
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
    // 金额
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    // 原因
    reason: DataTypes.STRING,
    // 还款日期
    repaymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // 还款类型
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 0 分期还 1 一次性还
      allowNull: false
    },
    // 利息
    interest: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false
    },
    // 凭证
    voucher: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 是否结清
    settle: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 未结清 1 已结清
      allowNull: false
    },
    // 备注
    remark: {
      type: DataTypes.STRING,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 在用 1 删除
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Lend',
  });
  return Lend;
};
