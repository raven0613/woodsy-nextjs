'use strict';
// import Article from '../models/article'
// import User from '../models/user'
const db = require('../models/index')
const { Users, Articles } = db;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const article = await Articles.findAll({
      raw: true,
      nest: true
    })
    const user = await Users.findAll({
      raw: true,
      nest: true
    })
    await queryInterface.bulkInsert('Comments',       
      Array.from({ length: 10 }).map((_, i) => (
        {
          content: 'tailwind 的重複 css class 可以拉出去 module.css 引入寫法要注意 class 名稱不能用一槓，例如 form-input',
          liked_counts: 0,
          reported_counts: 0,
          User_id: user[0].id,
          Article_id: article[i].id,
          created_at: new Date(),
          updated_at: new Date(),
          adult_only: false
        })
      ), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {});
  }
};
