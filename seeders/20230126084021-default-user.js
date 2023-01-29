'use strict';

import { hashSync, genSaltSync } from 'bcrypt';
const saltRounds = 10;
const SEED_USER = {
  name: 'root',
  account: 'root',
  email: 'root@example.com',
  password: '12345678',
  role: 'admin'
}

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const userId = await queryInterface.bulkInsert('Users', [{
    name: SEED_USER.name,
    account: SEED_USER.account,
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
        title: `article-${i + 1}`,
        content: `content-${i + 1}`,
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Articles', null, {});
  await queryInterface.bulkDelete('Hollows', null, {});
  return await queryInterface.bulkDelete('Users', null, {});
}
