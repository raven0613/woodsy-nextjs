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
    }
  }
  Comments.init({
    content: DataTypes.STRING,
    likedCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Comments',
    tableName: 'comments',
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