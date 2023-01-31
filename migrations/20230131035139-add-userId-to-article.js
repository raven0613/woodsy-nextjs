"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { //table名稱
        await queryInterface.addColumn("Articles", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Articles", "user_id");
    },
};
