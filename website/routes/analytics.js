// dependencias
let express = require("express");
let router = express.Router();
const {sequelize, sequelizeAzure} = require("../models");
const {getTrendDeg, getTrendBehavior} = require("../util/analytics/trendLine");
const {getMedicoesTrend} = require("../util/analytics/dados");
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
            let deg = new LinearModelOverTime(medicoes).getAngleInDegrees();

            let {orientacao, comportamento} = getTrendBehavior(deg);

            res.json({stauts: "ok", msg: {orientacao, comportamento}});
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

module.exports = router;
