let express = require("express");
let router = express.Router();
let {sequelize, sequelizeAzure} = require("../models");

router.post("/dados", async (req, res) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    const dados = `SELECT nome, email FROM staff WHERE id_staff = ${id}`;
    await sequelize
        .query(dados, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            await sequelizeAzure.query(dados, {
                type: sequelizeAzure.QueryTypes.SELECT
            });
        })
        .then(([staff]) => res.json({status: "ok", msg: staff}))
        .catch(err => res.json({status: "erro", msg: err}));
});

module.exports = router;
