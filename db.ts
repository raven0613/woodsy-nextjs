import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'woodsy_nextjs',
  dialect: 'mysql',
  username: 'root',
  password: 'password',
  storage: ':memory:',
  models: [__dirname + '/models'], // or [Player, Team],
});

sequelize.addModels(['./models']);