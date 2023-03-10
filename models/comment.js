'use strict';
const Articles = require('../models/article')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Users);
      Comments.belongsTo(models.Articles);
      // Comments.hasMany(models.Likeships, {
      //     foreignKey: 'comment_id',
      // });
      // Comments.hasMany(models.Reports, {
      //     foreignKey: 'comment_id',
      // });

      Comments.belongsToMany(models.Users, {
        through: models.Likeships,
        foreignKey: 'comment_id',
        as: 'LikedUsers'
      })
      Comments.belongsToMany(models.Users, {
        through: models.Reports,
        foreignKey: 'comment_id',
        as: 'ReportedUsers'
      })
    }
  }
  Comments.init({
    content: DataTypes.STRING,
    likedCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Comments',
    tableName: 'Comments',
    underscored: true
  });

  // Comments.addHook('afterCreate', async (comment, options) => {
  //   await Articles.update({ commentCounts: commentCounts + 1 }, {
  //     where: {
  //       id: comment.article_id
  //     },
  //     transaction: options.transaction
  //   });
  // });

  return Comments;
};