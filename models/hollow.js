'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hollows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hollows.belongsTo(models.Users);
      Hollows.hasMany(models.Articles, {  
        foreignKey: 'hollow_id' 
      });
      // Hollows.hasMany(models.Subscriptions, {  
      //   foreignKey: 'hollow_id' 
      // });
      // Hollows.hasMany(models.Reports, {  
      //   foreignKey: 'hollow_id' 
      // });

      Hollows.belongsToMany(models.Users, {
        through: models.Reports,
        foreignKey: 'hollow_id',
        as: 'ReportUsers'
      })
      Hollows.belongsToMany(models.Users, {
        through: models.Subscriptions,
        foreignKey: 'hollow_id',
        as: 'SubUsers'
      })
    }
  }
  Hollows.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    articleCounts: DataTypes.INTEGER,
    subCounts: DataTypes.INTEGER,
    reportedCounts: DataTypes.INTEGER,
  }, {
    sequelize,
    // modelName: 'Hollows',
    tableName: 'Hollows',
    underscored: true
  });
  return Hollows;
};