const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lend extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      Lend.belongsTo(models.User, {foreignKey: 'uId'})
    }
  }

  Lend.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
    },
    // 日期
    date: DataTypes.DATE, // 时间格式是ISO 8601格式的时间字符串
    // 借款人
    borrower: DataTypes.STRING,
    // 金额
    amount: DataTypes.DOUBLE,
    // 原因
    reason: DataTypes.STRING,
    // 还款日期
    repaymentDate: DataTypes.DATE,
    // 还款类型
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // 0 分期还 1 一次性还
    },
    // 利息
    interest: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    // 凭证
    voucher: DataTypes.STRING,
    // 是否结清
    settle: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // 0 未结清 1 已结清
    },
    // 备注
    remark: DataTypes.STRING,
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // 0 在用 1 删除
    },
    uId: {  // 外键 , 用于关联用户
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: { // 外键引用, 用于关联用户
      //   model: models.User,
      //   key: 'id'
      // }
    },
  }, {
    sequelize,
    modelName: 'Lend',
  });
  return Lend;
};
