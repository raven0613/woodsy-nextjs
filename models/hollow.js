'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hollow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hollow.belongsTo(models.Users);
      Hollow.hasMany(models.Articles, { foreignKey: 'hollowId' });
    }
  }
  Hollow.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    articleCounts: DataTypes.INTEGER,
    subCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Hollows',
    tableName: 'hollows',
    underscored: true
  });
  return Hollow;
};