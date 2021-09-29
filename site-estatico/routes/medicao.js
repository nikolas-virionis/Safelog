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
    let sql = `SELECT id_maquina FROM maquina JOIN usuario_maquina ON id_maquina = fk_maquina and fk_usuario = ${id}`;

    await sequelize
        .query(sql, { type: sequelize.QueryTypes.SELECT })
        .then(async (response) => {
            let incidentes = [];
            for (let { id_maquina } of response) {
                let incidente = `SELECT data_medicao, valor, unidade, medicao_limite, tipo_medicao.tipo, maquina.nome FROM maquina JOIN categoria_medicao ON id_maquina = fk_maquina JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao JOIN medicao ON fk_categoria_medicao = id_categoria_medicao and (IF(tipo_medicao.tipo like '%livre', medicao.valor <= categoria_medicao.medicao_limite, medicao.valor >= categoria_medicao.medicao_limite)) and id_maquina = '${id_maquina}' GROUP BY valor, tipo ORDER BY data_medicao DESC;`;
                await sequelize
                    .query(incidente, {
                        type: sequelize.QueryTypes.SELECT,
                    })
                    .then((result) => {
                        incidentes.push(result);
                    });
            }
            return res.json({ status: "ok", response: incidentes });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});
module.exports = router;
