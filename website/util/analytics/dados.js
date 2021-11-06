let sequelize = require("../../models").sequelize;
const getMedicoes = async idCategoriaMedicao => {
    const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 100`;
    return await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .then(medicoes => {
            medicoes = medicoes.map(el => Number(el.valor));
            medicoes = [...medicoes].reverse();
            return medicoes;
        });
};

module.exports = {getMedicoes};
