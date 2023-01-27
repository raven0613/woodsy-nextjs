"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Articles", "UserId", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Articles", "UserId");
    },
};
