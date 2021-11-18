let {sequelize} = require("../../models");

const deleteUsuario = async id => {
    let sqlDelContato = `DELETE FROM contato WHERE fk_usuario = ${id}`;
    let sqlDelUsMac = `DELETE FROM usuario_maquina WHERE id_usuario_maquina IN (SELECT id_usuario_maquina WHERE fk_usuario = ${id})`;
    let sqlDelChamado = `DELETE FROM chamado WHERE fk_usuario = ${id}`;
    let sqlDelSolucao = `DELETE FROM solucao WHERE fk_usuario = ${id}`;
    let sqlDelUsNotificacao = `DELETE FROM usuario_notificacao WHERE fk_usuario = ${id}`;
    let sqlDelUser = `DELETE FROM usuario WHERE id_usuario = ${id}`;
    // delete contatos
    return await sequelize
        .query(sqlDelContato, {type: sequelize.QueryTypes.DELETE})
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(sqlDelContato, {
                type: sequelizeAzure.QueryTypes.DELETE
            });
            return Promise.resolve();
        })
        .then(async () => {
            // delete usuario_maquina
            return await sequelize
                .query(sqlDelUsMac, {type: sequelize.QueryTypes.DELETE})
                .catch(err => Promise.resolve())
                .then(async () => {
                    await sequelizeAzure.query(sqlDelUsMac, {
                        type: sequelizeAzure.QueryTypes.DELETE
                    });
                    return Promise.resolve();
                })
                .then(async () => {
                    // delete usuario
                    return await sequelize
                        .query(sqlDelChamado, {
                            type: sequelize.QueryTypes.DELETE
                        })
                        .catch(err => Promise.resolve())
                        .then(async () => {
                            await sequelizeAzure.query(sqlDelChamado, {
                                type: sequelizeAzure.QueryTypes.DELETE
                            });
                            return Promise.resolve();
                        })
                        .then(async () => {
                            return await sequelize
                                .query(sqlDelSolucao, {
                                    type: sequelize.QueryTypes.DELETE
                                })
                                .catch(err => Promise.resolve())
                                .then(async () => {
                                    await sequelizeAzure.query(sqlDelSolucao, {
                                        type: sequelizeAzure.QueryTypes.DELETE
                                    });
                                    return Promise.resolve();
                                })
                                .then(async () => {
                                    return await sequelize
                                        .query(sqlDelUsNotificacao, {
                                            type: sequelize.QueryTypes.DELETE
                                        })
                                        .catch(err => Promise.resolve())
                                        .then(async () => {
                                            await sequelizeAzure.query(
                                                sqlDelUsNotificacao,
                                                {
                                                    type: sequelizeAzure
                                                        .QueryTypes.DELETE
                                                }
                                            );
                                            return Promise.resolve();
                                        })
                                        .then(async () => {
                                            return await sequelize
                                                .query(sqlDelUser, {
                                                    type: sequelize.QueryTypes
                                                        .DELETE
                                                })
                                                .catch(err => Promise.resolve())
                                                .then(async () => {
                                                    await sequelizeAzure.query(
                                                        sqlDelUser,
                                                        {
                                                            type: sequelizeAzure
                                                                .QueryTypes
                                                                .DELETE
                                                        }
                                                    );
                                                    return Promise.resolve();
                                                })
                                                .then(() => {
                                                    console.log(
                                                        "ljdsndgssfsafasfafaf\n\n",
                                                        {
                                                            status: "ok",
                                                            msg: "usuário deletado com sucesso"
                                                        }
                                                    );
                                                    return {
                                                        status: "ok",
                                                        msg: "usuário deletado com sucesso"
                                                    };
                                                })
                                                .catch(err => {
                                                    return {
                                                        status: "err",
                                                        msg: err
                                                    };
                                                });
                                        })
                                        .catch(err => {
                                            return {
                                                status: "err",
                                                msg: err
                                            };
                                        });
                                })
                                .catch(err => {
                                    return {
                                        status: "err",
                                        msg: err
                                    };
                                });
                        })
                        .catch(err => {
                            return {
                                status: "err",
                                msg: err
                            };
                        });
                })
                .catch(err => {
                    return {status: "err", msg: err};
                });
        })
        .catch(err => {
            return {status: "err", msg: err};
        });
};
module.exports = {deleteUsuario};
