'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Subscriptions.belongsTo(models.Users);
      // Subscriptions.belongsTo(models.Hollows);
    }
  }
  Subscriptions.init({
    user_id: DataTypes.INTEGER,
    hollow_id: DataTypes.INTEGER
  }, {
    sequelize,
    // modelName: 'Subscriptions',
    tableName: 'subscriptions',
    underscored: true
  });
  return Subscriptions;
};