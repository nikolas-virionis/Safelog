"use strict";

module.exports = (sequelize, DataTypes) => {
  let usuario = sequelize.define(
    "usuario",
    {
      id_usuario: {
        field: "id_usuario",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        field: "nome",
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        field: "email",
        type: DataTypes.STRING,
        allowNull: false,
      },
      senha: {
        field: "senha",
        type: DataTypes.STRING,
        allowNull: false,
      },
      cargo: {
        field: "cargo",
        type: DataTypes.ENUM,
        allowNull: false,
      },
      fk_empresa: {
        field: "fk_empresa",
        type: DataTypes.STRING,
        allowNull: false,
      },
      fk_supervisor: {
        field: "fk_empresa",
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "usuario",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  return usuario;
};
