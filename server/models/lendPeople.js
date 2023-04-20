const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LendPeople extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      LendPeople.belongsTo(models.User);
      LendPeople.hasMany(models.Lend);
    }
  }

  LendPeople.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
    },
    // 借款人
    borrower: DataTypes.STRING,
    // 总金额
    totalAmount: {
      type:DataTypes.DOUBLE,
      defaultValue: 0
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // 0 在用 1 删除
    }
  }, {
    sequelize,
    modelName: 'LendPeople',
  });
  return LendPeople;
};
