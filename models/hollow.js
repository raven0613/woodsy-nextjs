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
      // define association here
    }
  }
  Hollow.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    articleCounts: DataTypes.INTEGER,
    subCounts: DataTypes.INTEGER,
    isSub: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Hollow',
  });
  return Hollow;
};