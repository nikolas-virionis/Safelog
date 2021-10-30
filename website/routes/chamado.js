let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
const axios = require("axios").default;
const {abrirChamado} = require("../util/chamado/abertura");
const {getCategorias} = require("../util/get-user-machines/machines");

router.post("/criar", async (req, res) => {
    let {
        titulo,
        desc,
        prioridade,
        idCategoriaMedicao,
        idUsuario,
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
                res.json({
                    status: "alerta",
                    msg: "Chamado já aberto para essa métrica"
                });
            } else {
                // verificando se usuario tem acesso à máquina
                const sqlUsuarioTemAcesso = `SELECT * FROM usuario_maquina WHERE fk_usuario = ${idUsuario} AND fk_maquina = (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${idCategoriaMedicao})`;

                await sequelize
                    .query(sqlUsuarioTemAcesso, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(async ([response]) => {
                        if (response) {
                            // usuario tem acesso
                            if (eficaciaSolucoes) {
                                const updateEficaciaSolucoes = `UPDATE solucao SET eficacia = '${eficaciaSolucoes}' WHERE eficacia = 'total' AND fk_chamado = (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND status_chamado = 'aberto')`;

                                await sequelize
                                    .query(updateEficaciaSolucoes, {
                                        type: sequelize.QueryTypes.UPDATE
                                    })
                                    .catch(err => {
                                        res.json({status: "erro1", msg: err});
                                    });
                            }
                            abrirChamado(
                                titulo,
                                desc,
                                idUsuario,
                                idCategoriaMedicao,
                                prioridade
                            )
                                .then(resposta => {
                                    res.json(resposta);
                                })
                                .catch(err => {
                                    res.json({status: "erro1", msg: err});
                                });
                        } else {
                            const sqlGestorTemAcesso = `SELECT * FROM usuario_maquina JOIN usuario ON fk_usuario = id_usuario AND fk_supervisor = ${idUsuario} AND fk_maquina = (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${idCategoriaMedicao})`;
                            sequelize
                                .query(sqlGestorTemAcesso, {
                                    type: sequelize.QueryTypes.SELECT
                                })
                                .then(async ([response]) => {
                                    if (response) {
                                        abrirChamado(
                                            titulo,
                                            desc,
                                            idUsuario,
                                            idCategoriaMedicao,
                                            prioridade
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
                        }
                    })
                    .catch(err => {
                        return res.json({
                            status: "erro3",
                            msg: err
                        });
                    });
            }
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
    const sqlChamadoAberto = `SELECT status_chamado FROM chamado WHERE id_chamado = ${idChamado}`;

    await sequelize
        .query(sqlChamadoAberto, {type: sequelize.QueryTypes.SELECT})
        .then(async ([{status_chamado}]) => {
            if (status_chamado == "aberto") {
                // chamado aberto
                const updateStatusChamado = `UPDATE chamado SET status_chamado = 'fechado' WHERE id_chamado = ${idChamado}`;
                await sequelize
                    .query(updateStatusChamado, {
                        type: sequelize.QueryTypes.UPDATE
                    })
                    .then(async () => {
                        const criarSolucao = `INSERT INTO solucao(titulo, descricao, data_solucao, eficacia, fk_chamado, fk_usuario) VALUES ('${titulo}', '${desc}', NOW(), 'total', ${idChamado}, ${idUsuario})`;

                        await sequelize
                            .query(criarSolucao, {
                                type: sequelize.QueryTypes.INSERT
                            })
                            .then(async () => {
                                res.json({
                                    status: "ok",
                                    msg: "Solução inserida e chamado fechado com sucesso"
                                });
                            })
                            .catch(err =>
                                res.json({
                                    status: "erro3",
                                    msg: err
                                })
                            );
                    })
                    .catch(err =>
                        res.json({
                            status: "erro3",
                            msg: err
                        })
                    );
            } else {
                res.json({
                    status: "alerta",
                    msg: "Chamado já fechado/resolvido"
                });
            }
        })
        .catch(err => {
            return res.json({
                status: "erro3",
                msg: err
            });
        });
});

router.post("/lista", async (req, res) => {
    let {idUsuario} = req.body;
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
                                const sqlChamados = `SELECT id_chamado, c.titulo, data_abertura, status_chamado AS 'status', prioridade, (SELECT count(id_solucao) FROM chamado LEFT JOIN solucao ON eficacia <> 'nula' AND fk_chamado = id_chamado AND c.id_chamado = fk_chamado) as 'solucoes' FROM chamado as c LEFT JOIN solucao ON id_chamado = fk_chamado ORDER BY status, data_abertura, prioridade`;
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

    const sqlChamado = `SELECT titulo, descricao, data_abertura, status_chamado as 'status', prioridade, usuario.nome, usuario.email, fk_categoria_medicao FROM chamado JOIN usuario on fk_usuario = id_usuario WHERE id_chamado = ${idChamado}`;
    const sqlSolucoes = `SELECT titulo, descricao, data_solucao, eficacia, fk_usuario FROM solucao JOIN usuario on fk_usuario = id_usuario AND fk_chamado = ${idChamado}`;

    await sequelize
        .query(sqlChamado, {type: sequelize.QueryTypes.SELECT})
        .then(async ([chamado]) => {
            await sequelize
                .query(sqlSolucoes, {type: sequelize.QueryTypes.SELECT})
                .then(solucoes => {
                    res.json({status: "ok", msg: {...chamado, solucoes}});
                })
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});
module.exports = router;
