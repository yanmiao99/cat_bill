const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NoteLabelsAndCategory extends Model {
    // 定义类方法 (多表联查)
    static associate(models) {
      // 该表属于用户
      NoteLabelsAndCategory.belongsTo(models.User);
    }
  }

  NoteLabelsAndCategory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
      allowNull: false,
    },
    // 标签名称
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 分类还是标签
    type: {
      type: DataTypes.INTEGER, // 1 标签 2 分类
      allowNull: false,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 在用 1 删除
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'NoteLabelsAndCategory',
  });
  return NoteLabelsAndCategory;
};
