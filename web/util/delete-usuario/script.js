let { sequelize } = require("../../models");

const deleteUsuario = async (id) => {
    let sqlDelContato = `DELETE FROM contato WHERE fk_usuario = ${id}`;
    let sqlDelUsMac = `DELETE FROM usuario_maquina WHERE fk_usuario = ${id}`;
    let sqlDelUser = `DELETE FROM usuario WHERE id_usuario = ${id}`;
    // delete contatos
    await sequelize
        .query(sqlDelContato, { type: sequelize.QueryTypes.DELETE })
        .then(async (resultContato) => {
            // delete usuario_maquina
            await sequelize
                .query(sqlDelUsMac, { type: sequelize.QueryTypes.DELETE })
                .then(async (resultUsMac) => {
                    // delete usuario
                    await sequelize
                        .query(sqlDelUser, {
                            type: sequelize.QueryTypes.DELETE,
                        })
                        .then((resultUser) => {
                            console.log(resultUser);
                            return {
                                status: "ok",
                                msg: "usuário deletado com sucesso",
                            };
                        })
                        .catch((err) => {
                            return { status: "err", msg: err };
                        });
                })
                .catch((err) => {
                    return { status: "err", msg: err };
                });
        })
        .catch((err) => {
            return { status: "err", msg: err };
        });
};
module.exports = { deleteUsuario };
