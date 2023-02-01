'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log(models)
      //{
      //  Articles: Articles,
      //  Comments: Comments,
      //  Hollows: Hollows,
      //  Users: Users
      //}
      Articles.belongsTo(models.Users);
      Articles.belongsTo(models.Hollows);
      Articles.hasMany(models.Comments);
      // Articles.hasMany(models.Comments, { foreignKey: 'articleId' });
    }
  }
  Articles.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    commentCounts: DataTypes.INTEGER,
    collectedCounts: DataTypes.INTEGER,
    likedCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER,
  }, {
    sequelize,
    // modelName: 'Articles',
    tableName: 'articles',
    underscored: true
  });
  return Articles;
};