const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    static associate(models) {
      // upload 属于 user
      Upload.belongsTo(models.User);
    }
  }

  Upload.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // 是否是主键
      autoIncrement: true,       // 是否自增
      allowNull: false
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Upload',
  });
  return Upload;
};
