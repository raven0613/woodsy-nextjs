"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { //table名稱
        await queryInterface.addColumn("articles", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        });
        await queryInterface.addColumn("articles", "hollow_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Hollows",
                key: "id",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("articles", "user_id");
        await queryInterface.removeColumn("articles", "hollow_id");
    },
};
