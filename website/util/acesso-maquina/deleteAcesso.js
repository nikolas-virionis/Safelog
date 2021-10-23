let sequelize = require("../../models").sequelize;
const deleteAcesso = async (id, maquina) => {
    let delAcesso = `DELETE FROM usuario_maquina WHERE fk_usuario = ${id} AND fk_maquina = ${maquina}`;
    return await sequelize
        .query(delAcesso, {
            type: sequelize.QueryTypes.DELETE
        })
        .then(() => {
            return {
                status: "ok",
                msg: "Acesso removido"
            };
        })
        .catch(err => {
            return {
                status: "erro",
                msg: err
            };
        });
};
module.exports = {deleteAcesso};
