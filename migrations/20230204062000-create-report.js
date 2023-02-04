'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key:"id"
        }
      },
      hollow_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Hollows",
          key:"id"
        }
      },
      article_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Articles",
          key:"id"
        }
      },
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Comments",
          key:"id"
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};