// dependencias
let express = require("express");
let router = express.Router();
const {sequelize, sequelizeAzure} = require("../models");
const {getTrendBehavior} = require("../util/analytics/trendLine");
const {
    getMedicoesTrend,
    corrData,
    getRelevantCorr
} = require("../util/analytics/dados");
const {relatorio} = require("../util/analytics/relatorio");
const {mandarEmail} = require("../util/email/email");
const {LinearModelOverTime} = require("linear-regression-model");

router.post("/trend", async (req, res) => {
    let {idCategoriaMedicao, type, qtd} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    await getMedicoesTrend(req.body)
        .then(medicoes => {
            let lm = new LinearModelOverTime(medicoes);
            let deg = lm.getAngleInDegrees();

            let {orientacao, comportamento} = getTrendBehavior(deg);

            res.json({status: "ok", msg: {orientacao, comportamento}});
        })
        .catch(err => res.json({status: "alerta", err}));
});

router.post("/email-relatorio", async (req, res) => {
    let {id, maquinas} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    let sqlUsuario = `SELECT nome, email, cargo FROM usuario WHERE id_usuario = ${id}`;
    await sequelize
        .query(sqlUsuario, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            return Promise.resolve(
                await sequelizeAzure.query(sqlUsuario, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(async ([{nome, email, cargo}]) => {
            let relatorioStr = await relatorio(maquinas, cargo);

            mandarEmail("relatorio", nome, email, [relatorioStr])
                .then(() => {
                    res.json({
                        status: "ok",
                        msg: "Relatorio enviado com sucesso"
                    });
                })
                .catch(err => {
                    console.error("\n\n", err);
                });
        })
        .catch(err => {
            console.error("\n\n", err);
        });
});

router.post("/correlacao", async (req, res) => {
    let {maquina} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    let sqlMetricas = `SELECT tipo_medicao.tipo, id_categoria_medicao FROM categoria_medicao JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao AND fk_maquina = ${maquina}`;
    await sequelize
        .query(sqlMetricas, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(sqlMetricas, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async metricas => {
            let metricasCorr = await corrData(metricas);
            let correlacoes = await getRelevantCorr(metricasCorr);
            res.json({status: "ok", msg: correlacoes});
        })
        .catch(err => res.json({status: "error", msg: err}));
});

module.exports = router;
