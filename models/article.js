'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsTo(models.User)
    }
  }
  Article.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    collectedCounts: DataTypes.INTEGER,
    likedCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER,
    isCollected: DataTypes.BOOLEAN,
    isLiked: DataTypes.BOOLEAN,
    isReported: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'Articles',
    // underscored: true
  });
  return Article;
};