'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Model = require('sequelize');

const process = require('process');

// const basename = path.basename(__filename);
const modelPath = process.cwd() + '/models/';
const basename = path.basename(__dirname + '/../models/index.js');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// const Articles = require('./article');
// const Users = require('./user');
// const Comments = require('./comment');
// const Hollows = require('./hollow');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // .readdirSync(__dirname)
  .readdirSync(modelPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    const model = require(__dirname + '/../models/' + file)(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Articles = Articles(sequelize, Sequelize);
// db.Users = Users(sequelize, Sequelize);
// db.Comments = Comments(sequelize, Sequelize);
// db.Hollows = Hollows(sequelize, Sequelize);

// console.log('db '+ JSON.parse(JSON.stringify(db)))m


module.exports = db;
