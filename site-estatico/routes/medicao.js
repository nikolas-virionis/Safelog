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
    let sql = `SELECT id_maquina, limite_cpu, limite_ram, limite_disco FROM maquina JOIN usuario_maquina ON id_maquina = fk_maquina and fk_usuario = ${id}`;

    await sequelize
        .query(sql, { type: sequelize.QueryTypes.SELECT })
        .then(async (response) => {
            let incidentes = [];
            for (let {
                id_maquina,
                limite_cpu,
                limite_ram,
                limite_disco,
            } of response) {
                let incidente = `SELECT data_medicao, cpu, ram, disco, maquina.nome FROM usuario_maquina JOIN maquina ON usuario_maquina.fk_maquina = id_maquina and fk_usuario = ${id} JOIN analytics ON analytics.fk_maquina = maquina.id_maquina WHERE cpu >= ${limite_cpu} and id_maquina = '${id_maquina}' or ram >= ${limite_ram} and id_maquina = '${id_maquina}' or disco >= ${limite_disco} and id_maquina = '${id_maquina}' ORDER BY data_medicao desc LIMIT 15;`;
                await sequelize
                    .query(incidente, {
                        type: sequelize.QueryTypes.SELECT,
                    })
                    .then((result) => {
                        incidentes.push({
                            maquinas: [...result],
                            limite_cpu,
                            limite_ram,
                            limite_disco,
                        });
                    });
            }
            res.json({ status: "ok", response: incidentes });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});
module.exports = router;
