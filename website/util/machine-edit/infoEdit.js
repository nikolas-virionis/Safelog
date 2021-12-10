let {sequelize, sequelizeAzure} = require("../../models");
const {mandarEmail} = require("../email/email");
const {msg} = require("../notification/notification");
const {enviarNotificacao} = require("../notification/notify");
const edicaoMaquina = async (
    idAtual,
    novoId,
    novoNome,
    senhaAtual,
    novaSenha,
    selectType
) => {
    let updateType = {type: sequelize.QueryTypes.UPDATE};
    if (novaSenha && senhaAtual) {
        // alterando informações da máquina, incluindo senha

        // autenticando senha
        let sqlAuthPwd = `SELECT count(id_maquina) AS 'found' FROM maquina 
    WHERE senha = MD5('${senhaAtual}') AND id_maquina = '${idAtual}'`;

        return await sequelize
            .query(sqlAuthPwd, selectType)
            .catch(async err => {
                sqlAuthPwd = `SELECT count(id_maquina) AS 'found' FROM maquina 
            WHERE senha = HASHBYTES('md5', '${senhaAtual}') AND id_maquina = '${idAtual}'`;
                return Promise.resolve(
                    await sequelizeAzure.query(sqlAuthPwd, {
                        type: sequelizeAzure.QueryTypes.SELECT
                    })
                );
            })
            .then(async ([{found}]) => {
                if (found) {
                    // senha correta
                    let sqlUpdatePwd = `UPDATE maquina SET id_maquina = '${novoId}', nome = '${novoNome}', senha = MD5('${novaSenha}') WHERE id_maquina = '${idAtual}'`;

                    return await sequelize
                        .query(sqlUpdatePwd, updateType)
                        .catch(err => Promise.resolve())
                        .then(async () => {
                            sqlUpdatePwd = `UPDATE maquina SET id_maquina = '${novoId}', nome = '${novoNome}', senha = HASHBYTES('md5', '${novaSenha}') WHERE id_maquina = '${idAtual}'`;
                            await sequelizeAzure.query(sqlUpdatePwd, {
                                type: sequelizeAzure.QueryTypes.UPDATE
                            });
                            Promise.resolve();
                        })
                        .then(async resultUpdatePwd => {
                            return {
                                status: "ok",
                                msg: "Dados atualizados com sucesso"
                            };
                        })
                        .catch(err => {
                            return {
                                status: "erro",
                                msg: err
                            };
                        });
                } else {
                    return {
                        status: "erro",
                        msg: "Senha incorreta"
                    };
                }
            })
            .catch(err => {
                return {
                    status: "erro",
                    msg: err
                };
            });
    } else {
        // mantendo senha, alterando apenas nome e/ou id da máquina
        let sqlUpdateMac = `UPDATE maquina SET id_maquina = '${novoId}', nome = '${novoNome}' WHERE id_maquina = '${idAtual}'`;

        return await sequelize
            .query(sqlUpdateMac, updateType)
            .catch(err => Promise.resolve())
            .then(async () => {
                await sequelizeAzure.query(sqlUpdateMac, {
                    type: sequelizeAzure.QueryTypes.UPDATE
                });
                Promise.resolve();
            })
            .then(async resultMac => {
                return {
                    status: "ok",
                    msg: "Dados da máquina atualizados"
                };
            })
            .catch(err => {
                return {
                    status: "erro",
                    msg: err
                };
            });
    }
};

const emailUsuarios = async usuarios => {
    let resp;
    for (let usuario of usuarios) {
        if (usuario.responsavel == "s") {
            resp = {...usuario};
            continue;
        }
        let {nome, email} = usuario;
        await mandarEmail("notificacao edicao maquina", nome, email, [
            resp.nome
        ]);
    }
    console.log(resp);
    usuarios.shift();
    console.log(usuarios);
    await enviarNotificacao(usuarios, {
        tipo: "notificacao edicao maquina",
        msg: msg("notificacao edicao maquina", undefined, [resp.nome])
    });
};

module.exports = {edicaoMaquina, emailUsuarios};
