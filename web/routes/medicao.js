// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
let { getMachines } = require("../util/get-user-machines/script");

router.post("/relatorio-incidentes/analista", async (req, res, next) => {
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
            let incidente = `SELECT id_medicao, data_medicao, valor, unidade, tipo_medicao.tipo as tipo_categoria, maquina.nome, medicao.tipo as estado FROM maquina JOIN categoria_medicao ON id_maquina = fk_maquina JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao JOIN medicao ON fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'risco' OR fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'critico' where ${getMachines(
                response
            )} GROUP BY valor, tipo_medicao.tipo ORDER BY data_medicao DESC;`;
            await sequelize
                .query(incidente, {
                    type: sequelize.QueryTypes.SELECT,
                })
                .then((result) => {
                    incidentes.push(result);
                });
            return res.json({ status: "ok", response: incidentes });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});

router.post("/relatorio-incidentes/gestor", async (req, res, next) => {
    let { id } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
    let sql = `SELECT id_maquina FROM maquina JOIN usuario_maquina ON fk_maquina = id_maquina JOIN usuario ON fk_usuario = id_usuario AND fk_supervisor = ${id} GROUP BY id_maquina;`;

    await sequelize
        .query(sql, { type: sequelize.QueryTypes.SELECT })
        .then(async (response) => {
            let incidentes = [];
            let incidente = `SELECT id_medicao, data_medicao, valor, unidade, medicao_limite, tipo_medicao.tipo as tipo_categoria, maquina.nome, medicao.tipo as estado, usuario.nome as resp FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND responsavel = 's' JOIN maquina ON usuario_maquina.fk_maquina = id_maquina JOIN categoria_medicao ON id_maquina = categoria_medicao.fk_maquina JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao JOIN medicao ON fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'critico' WHERE ${getMachines(
                response
            )} GROUP BY valor, tipo_medicao.tipo ORDER BY data_medicao DESC;`;
            // res.json(incidente);
            await sequelize
                .query(incidente, {
                    type: sequelize.QueryTypes.SELECT,
                })
                .then((result) => {
                    incidentes.push(result);
                });
            return res.json({ status: "ok", response: incidentes });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});
module.exports = router;
