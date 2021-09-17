"use strict";

module.exports = (sequelize, DataTypes) => {
  let id_medicao = sequelize.define(
    "id_medicao",
    {
      id_medicao: {
        field: "id_medicao",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      valor: {
        field: "valor",
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      tipo: {
        field: "tipo",
        type: DataTypes.ENUM("normal", "risco", "critico"),
        allowNull: true,
      },
      data_medicao: {
        field: "data_medicao",
        type: DataTypes.DATE,
        allowNull: true,
      },
      fk_categoria_medicao: {
        field: "fk_categoria_medicao",
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "id_medicao",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  return id_medicao;
};
