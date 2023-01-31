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
      // define association here
      // Users.hasMany(models.Articles, {
      //     foreignKey: 'userId',
      // });
      Users.hasMany(models.Articles);
      
      Users.hasMany(models.Comments, {
          foreignKey: 'userId',
      });
      Users.hasMany(models.Hollows, {
          foreignKey: 'userId',
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