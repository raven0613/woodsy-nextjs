'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Collections.belongsTo(models.Users);
      // Collections.belongsTo(models.Articles);
    }
  }
  Collections.init({
    user_id: DataTypes.INTEGER,
    article_id: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Collections',
    tableName: 'Collections',
    underscored: true
  });
  return Collections;
};