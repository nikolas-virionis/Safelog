let express = require("express");
let router = express.Router();
let {sequelize, sequelizeAzure} = require("../models");
const axios = require("axios").default;
const {abrirChamado, getTipo} = require("../util/chamado/abertura");
const {verificarAcesso, usuariosComAcesso} = require("../util/chamado/acesso");
const {getStatsChamado} = require("../util/analytics/dados");
const {mandarEmail} = require("../util/email/email");
const {msg} = require("../util/notificacao/notificacao");
const {enviarNotificacao} = require("../util/notificacao/notificar");

router.post("/criar", async (req, res) => {
    let {
        titulo,
        desc,
        prioridade,
        idCategoriaMedicao,
        idUsuario,
        automatico,
        eficaciaSolucoes
    } = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    const chamadoJaAberto = `SELECT status_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND status_chamado = 'aberto'`;
    await sequelize
        .query(chamadoJaAberto, {type: sequelize.QueryTypes.SELECT})
        .then(async ([status]) => {
            if (status) {
                return res.json({
                    status: "alerta",
                    msg: "Chamado já aberto para essa métrica"
                });
            }
            // verificando se usuario tem acesso à máquina

            if (await verificarAcesso({idUsuario, idCategoriaMedicao})) {
                if (eficaciaSolucoes) {
                    const updateEficaciaSolucoes = `UPDATE solucao SET eficacia = '${eficaciaSolucoes}' WHERE eficacia = 'total' AND fk_chamado = (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND status_chamado = 'fechado' ORDER BY data_abertura DESC LIMIT 1)`;

                    await sequelize
                        .query(updateEficaciaSolucoes, {
                            type: sequelize.QueryTypes.UPDATE
                        })
                        .catch(err => {
                            res.json({
                                status: "erro1",
                                msg: err
                            });
                        });
                } else {
                    const primeiroChamado = `SELECT count(id_chamado) AS chamados FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao}`;

                    let erro = await sequelize
                        .query(primeiroChamado, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(([{chamados}]) => {
                            return !!chamados;
                        });
                    if (erro) {
                        return res.json({
                            status: "alerta",
                            msg: "Chamado de mesma métrica recentemente fechado. Ateste a eficácia da solução previamente proposta",
                            continuar: true
                        });
                    }
                }
                abrirChamado(
                    titulo,
                    desc,
                    idUsuario,
                    idCategoriaMedicao,
                    prioridade,
                    automatico
                )
                    .then(resposta => {
                        res.json(resposta);
                    })
                    .catch(err => {
                        res.json({
                            status2: "erro",
                            msg: err
                        });
                    });
            } else {
                // usuario não tem acesso
                res.json({
                    status: "alerta",
                    msg: "Usuário não tem acesso à máquina"
                });
            }
        })
        .catch(async err => {
            await sequelizeAzure
                .query(chamadoJaAberto, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
                .then(async ([status]) => {
                    if (status) {
                        return res.json({
                            status: "alerta",
                            msg: "Chamado já aberto para essa métrica"
                        });
                    }
                    // verificando se usuario tem acesso à máquina

                    if (
                        await verificarAcesso({idUsuario, idCategoriaMedicao})
                    ) {
                        if (eficaciaSolucoes) {
                            const updateEficaciaSolucoes = `UPDATE solucao SET eficacia = '${eficaciaSolucoes}' WHERE eficacia = 'total' AND fk_chamado = (SELECT TOP 1 id_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND status_chamado = 'fechado' ORDER BY data_abertura DESC)`;

                            await sequelizeAzure
                                .query(updateEficaciaSolucoes, {
                                    type: sequelizeAzure.QueryTypes.UPDATE
                                })
                                .catch(err => {
                                    res.json({
                                        status: "erro1",
                                        msg: err
                                    });
                                });
                        } else {
                            const primeiroChamado = `SELECT count(id_chamado) AS chamados FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao}`;

                            let erro = await sequelizeAzure
                                .query(primeiroChamado, {
                                    type: sequelizeAzure.QueryTypes.SELECT
                                })
                                .then(([{chamados}]) => {
                                    return !!chamados;
                                });
                            if (erro) {
                                return res.json({
                                    status: "alerta",
                                    msg: "Chamado de mesma métrica recentemente fechado. Ateste a eficácia da solução previamente proposta",
                                    continuar: true
                                });
                            }
                        }
                        abrirChamado(
                            titulo,
                            desc,
                            idUsuario,
                            idCategoriaMedicao,
                            prioridade,
                            automatico
                        )
                            .then(resposta => {
                                res.json(resposta);
                            })
                            .catch(err => {
                                res.json({
                                    status2: "erro",
                                    msg: err
                                });
                            });
                    } else {
                        // usuario não tem acesso
                        res.json({
                            status: "alerta",
                            msg: "Usuário não tem acesso à máquina"
                        });
                    }
                });
        });
});
router.post("/fechar", async (req, res) => {
    let {titulo, desc, idChamado, idUsuario} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    // verificando se chamado está aberto
    const sqlChamadoAberto = `SELECT titulo AS tituloChamado, status_chamado FROM chamado WHERE id_chamado = ${idChamado}`;

    await sequelize
        .query(sqlChamadoAberto, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            Promise.resolve(
                await sequelizeAzure.query(sqlChamadoAberto, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(async ([{tituloChamado, status_chamado}]) => {
            if (status_chamado != "aberto")
                return res.json({
                    status: "alerta",
                    msg: "Chamado já fechado/resolvido"
                });
            // chamado aberto
            const updateStatusChamado = `UPDATE chamado SET status_chamado = 'fechado' WHERE id_chamado = ${idChamado}`;
            await sequelize
                .query(updateStatusChamado, {
                    type: sequelize.QueryTypes.UPDATE
                })
                .catch(async err => {
                    Promise.resolve();
                })
                .then(async () => {
                    await sequelizeAzure.query(updateStatusChamado, {
                        type: sequelizeAzure.QueryTypes.UPDATE
                    });
                    Promise.resolve();
                })
                .then(async () => {
                    const criarSolucao = `INSERT INTO solucao(titulo, descricao, data_solucao, eficacia, fk_chamado, fk_usuario) VALUES ('${titulo}', '${desc}', NOW(), 'total', ${idChamado}, ${idUsuario})`;

                    await sequelize
                        .query(criarSolucao, {
                            type: sequelize.QueryTypes.INSERT
                        })
                        .catch(async err => {
                            Promise.resolve();
                        })
                        .then(async () => {
                            const criarSolucao = `INSERT INTO solucao(titulo, descricao, data_solucao, eficacia, fk_chamado, fk_usuario) VALUES ('${titulo}', '${desc}', getdate(), 'total', ${idChamado}, ${idUsuario})`;
                            await sequelizeAzure.query(criarSolucao, {
                                type: sequelizeAzure.QueryTypes.INSERT
                            });
                            Promise.resolve();
                        })
                        .then(async () => {
                            const usuarios = await usuariosComAcesso({
                                idChamado,
                                usuarioResp: idUsuario
                            });
                            const sql = `SELECT usuario.nome AS resp, (SELECT tipo_medicao.tipo FROM tipo_medicao JOIN categoria_medicao ON id_tipo_medicao = fk_tipo_medicao AND id_categoria_medicao = (SELECT fk_categoria_medicao FROM chamado WHERE id_chamado = ${idChamado})) AS metrica, (SELECT maquina.nome FROM maquina JOIN categoria_medicao ON pk_maquina = fk_maquina AND id_categoria_medicao = (SELECT fk_categoria_medicao FROM chamado WHERE id_chamado = ${idChamado})) AS maquina FROM usuario WHERE id_usuario = ${idUsuario}`;
                            await sequelize
                                .query(sql, {type: sequelize.QueryTypes.SELECT})
                                .catch(async err => {
                                    Promise.resolve(
                                        await sequelizeAzure.query(sql, {
                                            type: sequelizeAzure.QueryTypes
                                                .SELECT
                                        })
                                    );
                                })
                                .then(async ([{resp, maquina, metrica}]) => {
                                    enviarNotificacao(usuarios, {
                                        tipo: "chamado fechado",
                                        msg: msg("chamado fechado", undefined, [
                                            tituloChamado,
                                            getTipo(metrica),
                                            maquina,
                                            resp,
                                            titulo
                                        ])
                                    }).then(() => {
                                        for (let {nome, email} of usuarios) {
                                            mandarEmail(
                                                "chamado fechado",
                                                nome,
                                                email,
                                                [
                                                    tituloChamado,
                                                    getTipo(metrica),
                                                    maquina,
                                                    resp,
                                                    titulo
                                                ]
                                            );
                                        }
                                        return res.json({
                                            status: "ok",
                                            msg: "Solução inserida e chamado fechado com sucesso"
                                        });
                                    });
                                });
                        })
                        .catch(err => {
                            return res.json({
                                status: "erro3",
                                msg: err
                            });
                        });
                })
                .catch(err => {
                    return res.json({
                        status: "erro3",
                        msg: err
                    });
                });
        })
        .catch(err => {
            return res.json({
                status: "erro3",
                msg: err
            });
        });
});

router.post("/atualizar", async (req, res) => {
    let {idChamado, titulo, descricao, prioridade, eficaciaSolucoes} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    const updateChamado = `UPDATE chamado SET titulo = '${titulo}', descricao = '${descricao}', prioridade = '${prioridade}' WHERE id_chamado = ${idChamado}`;
    const updateSolucao = `UPDATE solucao SET eficacia = '${eficaciaSolucoes}' WHERE fk_chamado = ${idChamado}`;

    await sequelize
        .query(updateChamado, {type: sequelize.QueryTypes.UPDATE})
        .catch(async err => {
            Promise.resolve();
        })
        .then(async () => {
            await sequelizeAzure.query(updateChamado, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
            Promise.resolve();
        })
        .then(async () => {
            await sequelize
                .query(updateSolucao, {type: sequelize.QueryTypes.UPDATE})
                .catch(async err => {
                    Promise.resolve();
                })
                .then(async () => {
                    await sequelizeAzure.query(updateSolucao, {
                        type: sequelizeAzure.QueryTypes.UPDATE
                    });
                    Promise.resolve();
                })
                .then(() => {
                    res.json({
                        status: "ok",
                        msg: "Chamado atualizado com sucesso"
                    });
                })
                .catch(err => {
                    return res.json({
                        status: "erro3",
                        msg: err
                    });
                });
        })
        .catch(err => {
            return res.json({
                status: "erro3",
                msg: err
            });
        });
});

router.post("/lista", async (req, res) => {
    let {idUsuario, search} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    await axios
        .post("http://localhost:3000/usuario/dados", {id: idUsuario})
        .then(
            ({
                data: {
                    status,
                    msg: {cargo}
                }
            }) => {
                if (status === "ok") {
                    axios
                        .post(
                            `http://localhost:3000/maquina/lista-dependentes/${cargo}`,
                            {id: idUsuario}
                        )
                        .then(async ({data: {status, msg: maquinas}}) => {
                            if (status == "ok") {
                                let idCategorias = [];
                                for (let {pk_maquina} of maquinas) {
                                    const sqlCategorias = `SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${pk_maquina}`;
                                    await sequelize
                                        .query(sqlCategorias, {
                                            type: sequelize.QueryTypes.SELECT
                                        })
                                        .then(categorias => {
                                            for (let {
                                                id_categoria_medicao
                                            } of categorias) {
                                                idCategorias.push(
                                                    id_categoria_medicao
                                                );
                                            }
                                        });
                                }
                                // select id_chamado from chamado as c left join solucao on id_chamado = fk_chamado;
                                let sqlChamados = `SELECT * FROM v_chamados ORDER BY status, CASE prioridade WHEN 'emergencia' THEN 1 WHEN 'alta' THEN 2 WHEN 'media' THEN 3 ELSE 4 END, data_abertura DESC`;

                                if (search) {
                                    sqlChamados = `SELECT * FROM v_chamados WHERE titulo LIKE '%${search}%' OR status LIKE '%${search}%' OR prioridade LIKE '%${search}%' ORDER BY status, CASE prioridade WHEN 'emergencia' THEN 1 WHEN 'alta' THEN 2 WHEN 'media' THEN 3 ELSE 4 END, data_abertura DESC`;
                                }

                                await sequelize
                                    .query(sqlChamados, {
                                        type: sequelize.QueryTypes.SELECT
                                    })
                                    .then(async chamados =>
                                        res.json({
                                            status: "ok",
                                            msg: chamados
                                        })
                                    )
                                    .catch(err =>
                                        res.json({status: "erro", msg: err})
                                    );
                            } else {
                                res.json({status: "erro", msg});
                            }
                        });
                } else {
                    res.json({status: "erro", msg});
                }
            }
        );
});

router.post("/dados", async (req, res) => {
    let {idChamado} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    const sqlChamado = `SELECT chamado.*, usuario.nome, usuario.email, maquina.nome as maquina, tipo_medicao.tipo FROM chamado JOIN usuario on fk_usuario = id_usuario JOIN categoria_medicao ON fk_categoria_medicao = id_categoria_medicao JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao JOIN maquina ON fk_maquina = pk_maquina WHERE id_chamado = ${idChamado}`;
    const sqlSolucoes = `SELECT titulo, descricao, data_solucao, eficacia, usuario.nome, usuario.email FROM solucao JOIN usuario on fk_usuario = id_usuario AND fk_chamado = ${idChamado} ORDER BY eficacia DESC`;
    await sequelize
        .query(sqlChamado, {type: sequelize.QueryTypes.SELECT})
        .then(async ([chamado]) => {
            console.log(chamado);
            if (chamado) {
                await sequelize
                    .query(sqlSolucoes, {type: sequelize.QueryTypes.SELECT})
                    .then(async ([solucao]) => {
                        res.json({
                            status: "ok",
                            msg: {
                                ...chamado,
                                solucao,
                                qtdUsuarios: (
                                    await usuariosComAcesso({idChamado})
                                ).length
                            }
                        });
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            } else {
                res.json({
                    status: "erro",
                    msg: "chamado não encontrado"
                });
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/stats", async (req, res) => {
    let {idCategoriaMedicao, maquina, type, qtd} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    getStatsChamado(req.body)
        .then(response => {
            if (response.status == "erro") {
                res.json(response);
            } else {
                res.json({status: "ok", msg: response});
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

module.exports = router;
