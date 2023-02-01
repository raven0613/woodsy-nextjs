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
        await queryInterface.addColumn("Articles", "hollow_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Hollows",
                key: "id",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Articles", "user_id");
        await queryInterface.removeColumn("Articles", "hollow_id");
    },
};
