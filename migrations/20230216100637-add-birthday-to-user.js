'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { //table名稱
        await queryInterface.addColumn("Users", "birthday", {
            type: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Users", "birthday");
    },
};
