'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { //table名稱
        await queryInterface.addColumn("Articles", "adult_only", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Articles", "adult_only");
    },
};
