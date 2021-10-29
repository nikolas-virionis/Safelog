let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
const {abrirChamado} = require("../util/chamado/abertura");

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
    const chamadoJaAberto = `SELECT status_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao}`;
    await sequelize
        .query(chamadoJaAberto, {type: sequelize.QueryTypes.SELECT})
        .then(async ([status]) => {
            if (status?.status_chamado == "aberto") {
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
                                const updateEficaciaSolucoes = `UPDATE solucao SET eficacia = '${eficaciaSolucoes}' WHERE eficacia = 'total' AND fk_chamado = (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao})`;

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

module.exports = router;
