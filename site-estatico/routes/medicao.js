// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/relatorio-incidentes", async (req, res, next) => {
    let { id } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let sql = `SELECT data_medicao, cpu, ram, disco, maquina.nome FROM usuario JOIN usuario_maquina on fk_usuario = id_usuario JOIN maquina ON usuario_maquina.fk_maquina = maquina.id_maquina JOIN analytics ON analytics.fk_maquina = maquina.id_maquina WHERE id_usuario = ${id} and cpu > 70 or id_usuario = ${id} and ram > 70 or id_usuario = ${id} and disco > 70 ORDER BY data_medicao desc LIMIT 15;`;

    await sequelize
        .query(sql, { type: sequelize.QueryTypes.SELECT })
        .then((response) => {
            res.json({ status: "ok", response });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});
// let data = new Date(data)
// data.toLocaleDateString("pt-BR")
// data.toTimeString().slice(0, 8)
module.exports = router;
