'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { //table名稱
      await queryInterface.removeColumn("Users", "account");

  },

  async down(queryInterface, Sequelize) {
      await queryInterface.addColumn("Users", "account", {
          type: Sequelize.STRING,
          allowNull: false
      });
  },
};
