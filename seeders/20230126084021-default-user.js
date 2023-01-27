'use strict';

const bcrypt = require('bcrypt')
const saltRounds = 10;
const SEED_USER = {
  name: 'root',
  account: 'root',
  email: 'root@example.com',
  password: '12345678',
  role: 'admin'
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userId = await queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      account: SEED_USER.account,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(saltRounds), null),
      role: SEED_USER.role,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    return await queryInterface.bulkInsert('Articles',
      Array.from({ length: 10 }).map((_, i) => (
        {
          title: `article-${i}`,
          content: `content-${i}`,
          collectedCounts: 0,
          likedCounts: 0,
          reportedCounts: 0,
          isCollected: false,
          isLiked: false,
          isReported: false,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
    return await queryInterface.bulkDelete('Users', null, {});
  }
};
