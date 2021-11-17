let {sequelize, sequelizeAzure} = require("../../models");
const {usuariosComAcesso} = require("../chamado/acesso");
const {mandarEmail} = require("../email/email");
const {msg} = require("../notificacao/notificacao");
const {enviarNotificacao} = require("../notificacao/notificar");

const abrirChamado = async (
    titulo,
    desc,
    idUsuario,
    idCategoriaMedicao,
    prioridade,
    automatico
) => {
    let sqlCriaChamado = `INSERT INTO chamado(titulo, descricao, data_abertura, status_chamado, prioridade, automatico, fk_categoria_medicao, fk_usuario) VALUES ('${titulo}', '${desc}', NOW(), 'aberto', '${prioridade}', '${automatico}', ${idCategoriaMedicao}, ${idUsuario})`;
    let sqlCriaChamadoAzure = `INSERT INTO chamado(titulo, descricao, data_abertura, status_chamado, prioridade, automatico, fk_categoria_medicao, fk_usuario) VALUES ('${titulo}', '${desc}', getdate(), 'aberto', '${prioridade}', '${automatico}', ${idCategoriaMedicao}, ${idUsuario})`;

    return await sequelize
        .query(sqlCriaChamado, {
            type: sequelize.QueryTypes.INSERT
        })
        .catch(async err => {
            Promise.resolve();
        })
        .then(async () => {
            return await sequelizeAzure
                .query(sqlCriaChamadoAzure, {
                    type: sequelizeAzure.QueryTypes.INSERT
                })
                .catch(async err => {
                    return {status: "erro", msg: err};
                })
                .then(async () => {
                    const usuarios = await usuariosComAcesso({
                        idCategoriaMedicao,
                        usuarioResp: automatico == "n" ? idUsuario : false
                    });
                    const sql = `SELECT usuario.nome AS resp, (SELECT tipo_medicao.tipo FROM tipo_medicao JOIN categoria_medicao ON id_tipo_medicao = fk_tipo_medicao AND id_categoria_medicao = ${idCategoriaMedicao}) AS metrica, (SELECT maquina.nome FROM maquina JOIN categoria_medicao ON pk_maquina = fk_maquina AND id_categoria_medicao = ${idCategoriaMedicao}) AS maquina FROM usuario WHERE id_usuario = ${idUsuario}`;
                    return await sequelize
                        .query(sql, {type: sequelize.QueryTypes.SELECT})
                        .catch(async err => {
                            Promise.resolve(
                                await sequelizeAzure.query(sql, {
                                    type: sequelizeAzure.QueryTypes.SELECT
                                })
                            );
                        })
                        .then(async ([{resp, maquina, metrica}]) => {
                            return await notificarChamado(
                                usuarios,
                                resp,
                                maquina,
                                metrica,
                                automatico,
                                titulo
                            );
                        });
                });
        });
};

const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};

const notificarChamado = async (
    usuarios,
    resp,
    maquina,
    metrica,
    automatico,
    titulo
) => {
    return await enviarNotificacao(usuarios, {
        tipo: "chamado aberto",
        msg: msg("chamado aberto", undefined, [
            automatico,
            automatico == "n" ? resp : undefined,
            getTipo(metrica),
            maquina,
            titulo
        ])
    }).then(async () => {
        for (let {nome, email} of usuarios) {
            mandarEmail("chamado aberto", nome, email, [
                automatico,
                automatico == "n" ? resp : undefined,
                getTipo(metrica),
                maquina,
                titulo
            ]).catch(err => ({
                status: "erro",
                msg: err
            }));
        }

        return {
            status: "ok",
            msg: "Chamado aberto"
        };
    });
};

module.exports = {abrirChamado, getTipo};
