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

// conexão principal (MySQL localhost/AWS)
var sequelize = new Sequelize(config.database, config.username, config.password, config);

// configurando conexão com MSSQL (Azure) em ambiente de produção
if (env == 'production') {
  var sequelizeAzure = new Sequelize(configAzure.database, configAzure.username, configAzure.password, configAzure);
} else {
  // passando conexão vazia caso ambiente dev
  var sequelizeAzure = {
    query: function() {
      return Promise.resolve();
    },
    QueryTypes: sequelize.QueryTypes
  }
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
