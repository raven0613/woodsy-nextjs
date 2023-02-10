'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Reports.belongsTo(models.Users);
      // Reports.belongsTo(models.Hollows);
      // Reports.belongsTo(models.Articles);
      // Reports.belongsTo(models.Comments);
    }
  }
  Reports.init({
    user_id: DataTypes.INTEGER,
    hollow_id: DataTypes.INTEGER,
    article_id: DataTypes.INTEGER,
    comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Reports',
    tableName: 'reports',
    underscored: true
  });
  return Reports;
};