'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Articles, {
          foreignKey: 'user_id',
      });
      Users.hasMany(models.Comments, {
          foreignKey: 'user_id',
      });
      Users.hasMany(models.Hollows, {
          foreignKey: 'user_id',
      });
      Users.hasMany(models.Subscriptions, {  
        foreignKey: 'user_id' 
      });
      Users.hasMany(models.Collections, {
          foreignKey: 'user_id',
      });
      Users.hasMany(models.Likeships, {
          foreignKey: 'user_id',
      });
      Users.hasMany(models.Reports, {
          foreignKey: 'user_id',
      });
    }
  }
  Users.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    // modelName: 'Users',
    tableName: 'users',
    underscored: true
  });
  return Users;
};