let sequelize = require("../../models").sequelize;

const verificarAcesso = async ({idUsuario, idCategoriaMedicao, idChamado}) => {
    let sqlCategoria = ` AND fk_maquina = (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${idCategoriaMedicao})`;
    let sqlChamado = ` JOIN maquina ON usuario_maquina.fk_maquina = pk_maquina JOIN categoria_medicao ON pk_maquina = categoria_medicao.fk_maquina AND id_categoria_medicao = (SELECT fk_categoria_medicao FROM chamado WHERE id_chamado = ${idChamado})`;
    const sqlUsuarioTemAcesso = `SELECT count(fk_usuario) as usuarios FROM usuario_maquina WHERE fk_usuario = ${idUsuario} ${
        idChamado ? sqlChamado : sqlCategoria
    }`;

    return await sequelize
        .query(sqlUsuarioTemAcesso, {type: sequelize.QueryTypes.SELECT})
        .then(async ([{usuarios}]) => {
            if (usuarios) {
                return true;
            } else {
                const sqlGestorTemAcesso = `SELECT count(fk_usuario) as usuarios FROM usuario_maquina JOIN usuario ON fk_usuario = id_usuario AND fk_supervisor = ${idUsuario} ${
                    idChamado ? sqlChamado : sqlCategoria
                }`;
                return await sequelize
                    .query(sqlGestorTemAcesso, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(([{usuarios}]) => {
                        return !!usuarios;
                    })
                    .catch(err => {
                        return {
                            status: "erro",
                            msg: err
                        };
                    });
            }
        });
};

const usuariosComAcesso = async ({
    idChamado,
    idCategoriaMedicao,
    usuarioResp,
    gestor = true
} = {}) => {
    const getUsuarios = `SELECT id_usuario, usuario.nome, email FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_maquina = (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${
        idCategoriaMedicao ??
        `(SELECT fk_categoria_medicao FROM chamado WHERE id_chamado = ${idChamado})`
    })${usuarioResp ? ` WHERE id_usuario <> ${usuarioResp}` : ""}`;

    return await sequelize
        .query(getUsuarios, {type: sequelize.QueryTypes.SELECT})
        .then(async usuarios => {
            if (gestor) {
                const sqlGestores = `SELECT g.id_usuario, g.nome, g.email FROM usuario AS g JOIN usuario AS a ON g.id_usuario = a.fk_supervisor JOIN usuario_maquina ON a.id_usuario = fk_usuario AND fk_maquina = (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${
                    idCategoriaMedicao ??
                    `(SELECT fk_categoria_medicao FROM chamado WHERE id_chamado = ${idChamado})`
                })${
                    usuarioResp ? ` WHERE g.id_usuario <> ${usuarioResp}` : ""
                }`;
                let gestores = await sequelize.query(sqlGestores, {
                    type: sequelize.QueryTypes.SELECT
                });

                const ids = gestores.map(o => o.id_usuario);
                gestores = gestores.filter(
                    ({id_usuario}, index) =>
                        !ids.includes(id_usuario, index + 1)
                );
                usuarios = [...usuarios, ...gestores];
            }
            usuarios = await Promise.all(
                usuarios.map(async usuario => {
                    const sqlContatos = `SELECT forma_contato.nome, contato.valor, contato.identificador FROM forma_contato JOIN contato ON fk_forma_contato = id_forma_contato JOIN usuario ON fk_usuario = id_usuario AND fk_usuario = ${usuario.id_usuario};`;
                    return await sequelize
                        .query(sqlContatos, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(contatos => {
                            // console.log({...usuario, contatos});
                            return {...usuario, contatos};
                        })
                        .catch(err => console.error(err));
                })
            );
            return usuarios;
        })
        .catch(err => {
            return {
                status: "erro",
                msg: err
            };
        });
};
module.exports = {verificarAcesso, usuariosComAcesso};
