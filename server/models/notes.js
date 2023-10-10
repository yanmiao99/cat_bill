const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      Notes.belongsTo(models.User);
    }
  }

  Notes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
      allowNull: false,
    },
    // 封面
    cover: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 标题
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 详情
    detail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 标签
    tag: {
      type: DataTypes.JSON,
      allowNull: false
    },
    // 分类
    category: {
      type: DataTypes.JSON,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 在用 1 删除
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Notes',
  });
  return Notes;
};
