let {sequelize, sequelizeAzure} = require("../../models");
let {mandarEmail} = require("../email/email");
const {generateToken} = require("../token-user/token");
const {msg} = require("../notification/notification");
const {enviarNotificacao} = require("../notification/notify");

const escolhaResp = async (id, maquina) => {
    let sql = `SELECT g.id_usuario as id, g.nome as nomeGestor, g.email, a.nome, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${maquina}`;
    return await sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .catch(async err => {
            return Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(([{id, nome, nomeMaquina, nomeGestor, email}]) => {
            console.log("\n\n", id);
            mandarEmail("redefinir responsavel", nomeGestor, email, [
                nome,
                nomeMaquina
            ])
                .then(() => {
                    enviarNotificacao([{id_usuario: id}], {
                        tipo: "redefinir responsavel",
                        msg: msg(
                            "redefinir responsavel",
                            nomeGestor,
                            [nome, nomeMaquina],
                            email
                        )
                    }).catch(err => {
                        return {
                            status: "erro",
                            msg: err
                        };
                    });
                })
                .catch(err => {
                    return {
                        status: "erro",
                        msg: err
                    };
                });
        });
};

const escolhaAuto = async maquina => {
    let updateResponsavel = `UPDATE usuario_maquina SET responsavel = 's' WHERE fk_maquina = ${maquina} AND responsavel = 'n'`;

    return await sequelize
        .query(updateResponsavel, {
            type: sequelize.QueryTypes.UPDATE
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(updateResponsavel, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
            return Promise.resolve();
        })
        .then(async () => {
            const sql = `SELECT id_usuario as id, usuario.nome as nome, email, maquina.nome as maq FROM usuario JOIN usuario_maquina ON id_usuario = fk_usuario AND responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${maquina}`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.SELECT})
                .catch(async err =>
                    Promise.resolve(
                        await sequelizeAzure.query(sql, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(([{id, nome, email, maq}]) => {
                    mandarEmail("convite responsavel", nome, email, [maq]).then(
                        () => {
                            // notify
                            enviarNotificacao([id], {
                                tipo: "convite responsavel",
                                msg: msg("convite responsavel", nome, [maq])
                            });
                        }
                    );
                });
        })
        .catch(err => {
            return {
                status: "erro",
                err
            };
        });
};

const conviteResp = async (id, maquina, tipo) => {
    let sql = `SELECT g.id_usuario, g.nome as nomeGestor, g.email, a.nome, pk_maquina, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = pk_maquina WHERE id_maquina = '${maquina}' OR pk_maquina = ${maquina}`;
    await sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(
            async ([
                {id_usuario, nome, nomeMaquina, nomeGestor, email, pk_maquina}
            ]) => {
                let token = generateToken();
                let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${email}'`;
                return await sequelize
                    .query(updateToken, {
                        type: sequelize.QueryTypes.UPDATE
                    })
                    .catch(err => Promise.resolve())
                    .then(async () => {
                        await sequelizeAzure.query(updateToken, {
                            type: sequelizeAzure.QueryTypes.UPDATE
                        });
                        return Promise.resolve();
                    })
                    .then(() => {
                        mandarEmail(tipo, nomeGestor, email, [
                            nome,
                            nomeMaquina,
                            pk_maquina,
                            token
                        ])
                            .then(() => {
                                console.log("ca");
                                enviarNotificacao([{id_usuario}], {
                                    tipo,
                                    msg: msg(
                                        tipo,
                                        nomeGestor,
                                        [nome, nomeMaquina, pk_maquina, token],
                                        email
                                    )
                                });
                            })
                            .catch(err => {
                                return {
                                    status: "erro",
                                    msg: err
                                };
                            });
                    })
                    .catch(err => {
                        return {
                            status: "erro",
                            msg: err
                        };
                    });
            }
        )
        .catch(err => {
            return {
                status: "erro",
                err
            };
        });
};

const redirecionamentoAcessos = async (id, maquina, resposta, tipo) => {
    let del = true;
    resposta = resposta.map(el => el?.fk_usuario);
    if (!resposta.length) {
        //reatribuição de responsavel
        del = false;
        await conviteResp(id, maquina, tipo);
    } else if (resposta.length == 1) {
        await escolhaAuto(maquina);
        //redefinição automática de responsavel
    } else {
        del = false;
        //redefinição de responsavel
        // retorno de erro da função
        await escolhaResp(id, maquina);
    }
    return del;
};
module.exports = {redirecionamentoAcessos};
