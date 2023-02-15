'use strict';

const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const Model = require('sequelize');

const process = require('process');

// const basename = path.basename(__filename);

const modelPath = process.cwd() + '/models/';
console.log('modelPath', modelPath);
const basename = path.basename(__dirname + '/../models/index.js');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};



let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const Articles = require('./article')(sequelize, Sequelize.DataTypes)
const Users = require('./user')(sequelize, Sequelize.DataTypes)
const Hollows = require('./hollow')(sequelize, Sequelize.DataTypes)
const Comments = require('./comment')(sequelize, Sequelize.DataTypes)
const Collections = require('./collection')(sequelize, Sequelize.DataTypes)
const Likeships = require('./likeship')(sequelize, Sequelize.DataTypes)
const Reports = require('./report')(sequelize, Sequelize.DataTypes)
const Subscriptions = require('./subscription')(sequelize, Sequelize.DataTypes)

db.Articles = Articles
db.Users = Users
db.Comments = Comments
db.Hollows = Hollows
db.Collections = Collections
db.Likeships = Likeships
db.Reports = Reports
db.Subscriptions = Subscriptions

// fs
//   // .readdirSync(__dirname)
//   .readdirSync(modelPath)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
  // .forEach(file => {
  //   // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  //   const model = require(__dirname + '/../models/' + file)(sequelize, Sequelize.DataTypes);

  //   db[model.name] = model;
  // });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// console.log('db '+ JSON.parse(JSON.stringify(db)))


module.exports = db;
