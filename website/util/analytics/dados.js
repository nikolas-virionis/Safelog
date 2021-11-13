let sequelize = require("../../models").sequelize;

const getMedicoesTrend = async ({
    idCategoriaMedicao,
    type = "week",
    qtd = 1
} = {}) => {
    if (!idCategoriaMedicao)
        throw "É necessário a identificação da métrica para continuar";

    let sqlMedicoes;

    if (type == "day") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} DAY) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "week") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} WEEK) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "month") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} MONTH) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "qtd") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT ${qtd}`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }
    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 100`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 200`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 50`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 2 WEEK) AND NOW() ORDER BY data_medicao DESC`;
    return await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .then(medicoes => {
            if (!medicoes.length) throw "0 medições no período selecionado";
            medicoes = medicoes.map(el => Number(el.valor));
            medicoes = [...medicoes].reverse();
            return medicoes;
        });
};


module.exports = {getMedicoesTrend, getStatsChamado};
