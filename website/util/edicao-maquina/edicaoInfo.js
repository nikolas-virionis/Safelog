let sequelize = require("../../models").sequelize;
const {mandarEmail} = require("../email/email");
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
            .then(async ([{found}]) => {
                if (found) {
                    // senha correta
                    let sqlUpdatePwd = `UPDATE maquina SET id_maquina = '${novoId}', nome = '${novoNome}', senha = MD5('${novaSenha}') WHERE id_maquina = '${idAtual}'`;

                    return await sequelize
                        .query(sqlUpdatePwd, updateType)
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
};

module.exports = {edicaoMaquina, emailUsuarios};
