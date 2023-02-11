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
      Articles.hasMany(models.Comments, {
          foreignKey: 'article_id',
      });
      // Articles.hasMany(models.Collections, {
      //     foreignKey: 'article_id',
      // });
      // Articles.hasMany(models.Likeships, {
      //     foreignKey: 'article_id',
      // });
      // Articles.hasMany(models.Reports, {
      //     foreignKey: 'article_id',
      // });

      Articles.belongsToMany(models.Users, {
        through: models.Collections,
        foreignKey: 'article_id',
        as: 'CollectedUsers'
      })
      Articles.belongsToMany(models.Users, {
        through: models.Likeships,
        foreignKey: 'article_id',
        as: 'LikedUsers'
      })
      Articles.belongsToMany(models.Users, {
        through: models.Reports,
        foreignKey: 'article_id',
        as: 'ReportedUsers'
      })
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
    tableName: 'Articles',
    underscored: true
  });
  return Articles;
};