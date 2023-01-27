'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      collectedCounts: {
        type: Sequelize.INTEGER
      },
      likedCounts: {
        type: Sequelize.INTEGER
      },
      reportedCounts: {
        type: Sequelize.INTEGER
      },
      isCollected: {
        type: Sequelize.BOOLEAN
      },
      isLiked: {
        type: Sequelize.BOOLEAN
      },
      isReported: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
  }
};