let sequelize = require("../../models").sequelize;

const getMedicoes = async idCategoriaMedicao => {
    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW() ORDER BY data_medicao DESC`;

    const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 100`;

    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 200`;

    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 50`;

    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW() ORDER BY data_medicao DESC`;

    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW() ORDER BY data_medicao DESC`;

    // const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 2 WEEK) AND NOW() ORDER BY data_medicao DESC`;
    return await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .then(medicoes => {
            if (!medicoes.length) throw "0 medições no período selecionado";
            medicoes = medicoes.map(el => Number(el.valor));
            medicoes = [...medicoes].reverse();
            return medicoes;
        });
};

module.exports = {getMedicoes};
