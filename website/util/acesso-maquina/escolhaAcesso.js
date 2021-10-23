let sequelize = require("../../models").sequelize;
let {mandarEmail} = require("../email/email");
const {generateToken} = require("../token-user/token");

const escolhaResp = async (id, maquina) => {
    let sql = `SELECT g.nome as nomeGestor, g.email, a.nome, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = id_maquina AND id_maquina = '${maquina}'`;
    return await sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(([{nome, nomeMaquina, nomeGestor, email}]) => {
            mandarEmail("redefinir responsavel", nomeGestor, email, [
                nome,
                nomeMaquina
            ]).catch(err => {
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
};

const escolhaAuto = async maquina => {
    let updateResponsavel = `UPDATE usuario_maquina SET responsavel = 's' WHERE fk_maquina = ${maquina} AND responsavel = 'n'`;

    return await sequelize
        .query(updateResponsavel, {
            type: sequelize.QueryTypes.UPDATE
        })
        .catch(err => {
            return {
                status: "erro",
                err
            };
        });
};

const conviteResp = async (id, maquina, tipo) => {
    let sql = `SELECT g.nome as nomeGestor, g.email, a.nome, pk_maquina, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = pk_maquina WHERE id_maquina = '${maquina}' OR pk_maquina = ${maquina}`;
    await sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(async ([{nome, nomeMaquina, nomeGestor, email, pk_maquina}]) => {
            console.log("ca");
            let token = generateToken();
            let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${email}'`;
            return await sequelize
                .query(updateToken, {
                    type: sequelize.QueryTypes.UPDATE
                })
                .then(() => {
                    mandarEmail(tipo, nomeGestor, email, [
                        nome,
                        nomeMaquina,
                        pk_maquina,
                        token
                    ]).catch(err => {
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
        })
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
    if (resposta.length == 0) {
        //reatribuição de responsavel
        del = false;
        conviteResp(id, maquina, tipo);
    } else if (resposta.length == 1) {
        escolhaAuto(maquina);
        //redefinição automática de responsavel
    } else {
        //redefinição de responsavel
        // retorno de erro da função
        escolhaResp(id, maquina);
    }
    return del;
};
module.exports = {redirecionamentoAcessos};
