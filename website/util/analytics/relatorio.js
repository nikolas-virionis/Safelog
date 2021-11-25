let {sequelize, sequelizeAzure} = require("../../models");

const relatorio = async (maquinas, cargo) => {
    let {queryDate, data} = getDates(cargo);
    maquinas.map(async el => {
        let sqlFks = `SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${el.pk_maquina}`;
        return await sequelize
            .query(sqlFks, {type: sequelize.QueryTypes.SELECT})
            .then(fks => ({...el, fksCategoria: fks}))
            .catch(err => console.error(err));
    });
};

const statsChamado = async (maquinas, queryDate) => {};

const statsMedicao = async (maquinas, queryDate) => {};

const statsTrend = async (maquinas, queryDate) => {};

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
