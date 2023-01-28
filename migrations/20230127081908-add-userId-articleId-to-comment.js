'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("comments", "user_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    });
    await queryInterface.addColumn("comments", "article_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Articles",
            key: "id",
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("comments", "article_id");
    await queryInterface.removeColumn("comments", "user_id");
  }
};
