'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];
var configAzure = require(__dirname + '/../config/config.js')["backup"];
var db        = {};

console.warn(`\n===> você está no ambiente: ${env}\n`);

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
  var sequelizeAzure = new Sequelize(process.env[config.backup], configAzure);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var sequelizeAzure = new Sequelize(configAzure.database, configAzure.username, configAzure.password, configAzure);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.sequelizeAzure = sequelizeAzure;
db.Sequelize = Sequelize;

// console.warn(db.sequelizeAzure);

module.exports = db;
