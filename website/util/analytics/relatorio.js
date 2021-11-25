let {sequelize, sequelizeAzure} = require("../../models");

const relatorio = async (maquinas, cargo) => {
    let {queryDate, data} = getDates(cargo);
};

const statsChamado = async (maquinas, queryDate, data) => {};

const statsMedicao = async (maquinas, queryDate, data) => {};

const statsTrend = async (maquinas, queryDate, data) => {};

const getDates = cargo => {
    if (cargo == "analista") {
        return {
            queryDate: "DAY",
            data: "dia"
        };
    }
    return {
        queryDate: "WEEK",
        data: "semana"
    };
};

module.exports = {relatorio};
