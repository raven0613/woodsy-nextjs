'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Hollows", "user_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Hollows", "user_id");
  }
};
