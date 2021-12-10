let {sequelize, sequelizeAzure} = require("../../models");
const enviarNotificacao = async (usuarios, notificacao) => {
    // usuarios => array de usuarios
    // notificacao => obj com:
    //              lista representando mensagem e titulo ./notificacao.js/msg()
    //              tipo => alerta ou qualquer outro
    let {
        tipo,
        msg: [mensagem, titulo]
    } = notificacao;
    if (titulo.includes(" - SafeLog")) {
        titulo = titulo.replace(" - SafeLog", "");
    }
    const sqlInsertNotificacao = `INSERT INTO notificacao(titulo, mensagem, tipo) VALUES ('${titulo}', '${mensagem}','${
        tipo == "alerta" ? tipo : "notificacao"
    }')`;
    const sqlIdNotificacao = `SELECT id_notificacao FROM notificacao ORDER BY id_notificacao DESC LIMIT 1`;
    await sequelize
        .query(sqlInsertNotificacao, {
            type: sequelize.QueryTypes.INSERT
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(sqlInsertNotificacao, {
                type: sequelizeAzure.QueryTypes.INSERT
            });
            return Promise.resolve();
        })
        .then(async () => {
            await sequelize
                .query(sqlIdNotificacao, {type: sequelize.QueryTypes.SELECT})
                .catch(async err =>
                    Promise.resolve(
                        await sequelizeAzure.query(sqlIdNotificacao, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(async ([{id_notificacao: idNotificacao}]) => {
                    for (let usuario of usuarios) {
                        let atribuirNotificacao = `INSERT INTO usuario_notificacao(fk_usuario, fk_notificacao, lido, data_notificacao) VALUES (${
                            usuario?.id_usuario ?? usuario
                        }, ${idNotificacao}, 'n', now())`;
                        await sequelize
                            .query(atribuirNotificacao, {
                                type: sequelize.QueryTypes.INSERT
                            })
                            .catch(err => Promise.resolve())
                            .then(async () => {
                                atribuirNotificacao = `INSERT INTO usuario_notificacao(fk_usuario, fk_notificacao, lido, data_notificacao) VALUES (${
                                    usuario?.id_usuario ?? usuario
                                }, ${idNotificacao}, 'n', getdate())`;
                                await sequelizeAzure.query(
                                    atribuirNotificacao,
                                    {
                                        type: sequelizeAzure.QueryTypes.INSERT
                                    }
                                );
                                return Promise.resolve();
                            });
                    }
                });
        });
};

module.exports = {enviarNotificacao};
