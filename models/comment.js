'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    content: DataTypes.STRING,
    likedCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER,
    isLiked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};