let sequelize = require("../../models").sequelize;
const abrirChamado = async (
    titulo,
    desc,
    idUsuario,
    idCategoriaMedicao,
    prioridade,
    automatico
) => {
    let sqlCriaChamado = `INSERT INTO chamado(titulo, descricao, data_abertura, status_chamado, prioridade, automatico, fk_categoria_medicao, fk_usuario) VALUES ('${titulo}', '${desc}', NOW(), 'aberto', '${prioridade}', '${automatico}', ${idCategoriaMedicao}, ${idUsuario})`;

    return sequelize
        .query(sqlCriaChamado, {
            type: sequelize.QueryTypes.INSERT
        })
        .then(() => {
            return {
                status: "ok",
                msg: "Chamado aberto"
            };
        })
        .catch(err => {
            return {
                status: "erro",
                msg: err
            };
        });
};

module.exports = {abrirChamado};
