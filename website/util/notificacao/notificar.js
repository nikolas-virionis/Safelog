let sequelize = require("../../models").sequelize;
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
        .then(async () => {
            await sequelize
                .query(sqlIdNotificacao, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{id_notificacao: idNotificacao}]) => {
                    for (let usuario of usuarios) {
                        const atribuirNotificacao = `INSERT INTO usuario_notificacao(fk_usuario, fk_notificacao, lido, data_notificacao) VALUES (${
                            usuario?.id_usuario ?? usuario
                        }, ${idNotificacao}, 'n', now())`;
                        await sequelize.query(atribuirNotificacao, {
                            type: sequelize.QueryTypes.INSERT
                        });
                    }
                });
        });
};

module.exports = {enviarNotificacao};
