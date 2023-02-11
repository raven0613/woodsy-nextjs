'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likeships extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Likeships.belongsTo(models.Users);
      // Likeships.belongsTo(models.Articles);
      // Likeships.belongsTo(models.Comments);
    }
  }
  Likeships.init({
    user_id: DataTypes.INTEGER,
    article_id: DataTypes.INTEGER,
    comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Likeships',
    tableName: 'Likeships',
    underscored: true
  });
  return Likeships;
};