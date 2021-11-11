// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
const {getTrendDeg, getTrendBehavior} = require("../util/analytics/trendLine");
const {getMedicoes} = require("../util/analytics/dados");

router.post("/trend", async (req, res) => {
    let {idCategoriaMedicao} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    await getMedicoes(idCategoriaMedicao)
        .then(medicoes => {
            let deg = getTrendDeg(medicoes);

            let {orientacao, comportamento} = getTrendBehavior(deg);

            res.json({stauts: "ok", msg: {orientacao, comportamento}});
        })
        .catch(err => res.json({status: "alerta", err}));
});

module.exports = router;