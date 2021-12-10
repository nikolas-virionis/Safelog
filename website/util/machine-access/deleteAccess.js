let {sequelize, sequelizeAzure} = require("../../models");
const deleteAcesso = async (id, maquina) => {
    let delAcesso = `DELETE FROM usuario_maquina WHERE fk_usuario = ${id} AND fk_maquina = ${maquina}`;
    return await sequelize
        .query(delAcesso, {
            type: sequelize.QueryTypes.DELETE
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(delAcesso, {
                type: sequelizeAzure.QueryTypes.DELETE
            });
            return Promise.resolve();
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
