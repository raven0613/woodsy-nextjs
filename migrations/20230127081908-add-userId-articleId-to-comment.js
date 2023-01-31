'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "user_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    });
    await queryInterface.addColumn("Comments", "article_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Articles",
            key: "id",
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Comments", "article_id");
    await queryInterface.removeColumn("Comments", "user_id");
  }
};
