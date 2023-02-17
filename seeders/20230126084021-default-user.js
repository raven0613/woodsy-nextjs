'use strict';

const bcrypt = require('bcrypt')
const { hashSync, genSaltSync } = bcrypt
// import { hashSync, genSaltSync } from 'bcrypt';
const saltRounds = 10;
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678',
  role: 'admin'
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = await queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hashSync(SEED_USER.password, genSaltSync(saltRounds), null),
      role: SEED_USER.role,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
    const hollowId = await queryInterface.bulkInsert('Hollows',
      [{
        name: 'hollow-1',
        type: 'public',
        article_counts: 10,
        sub_counts: 0,
        reported_counts: 0,
        User_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      }], {});
    return await queryInterface.bulkInsert('Articles',
      Array.from({ length: 10 }).map((_, i) => (
        {
          title: 'httponly可以不讓 user 用 js 來操縱 cookie',
          content: 'tailwind 的重複 css class 可以拉出去 module.css 引入寫法要注意 class 名稱不能用一槓，例如 form-input',
          comment_counts: 1,
          collected_counts: 0,
          liked_counts: 0,
          reported_counts: 0,
          User_id: userId,
          Hollow_id: hollowId,
          created_at: new Date(),
          updated_at: new Date()
        })
      ), {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
    await queryInterface.bulkDelete('Hollows', null, {});
    return await queryInterface.bulkDelete('Users', null, {});
  }
}