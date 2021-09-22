// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/lista-dependentes", async (req, res) => {
    let { id } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
    let dependentes = `SELECT id_maquina, nome FROM maquina JOIN usuario_maquina ON fk_maquina = id_maquina and fk_usuario = ${id}`;
    await sequelize
        .query(dependentes, { type: sequelize.QueryTypes.SELECT })
        .then(async (response) => {
            let maquinas = [];
            for (let { id_maquina, nome } of response) {
                let responsavel = `SELECT usuario.nome FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' and fk_maquina = '${id_maquina}';`;
                await sequelize
                    .query(responsavel, {
                        type: sequelize.QueryTypes.SELECT,
                    })
                    .then(([{ nome: usuario }]) =>
                        maquinas.push({
                            id_maquina,
                            nome,
                            responsavel: usuario,
                        })
                    )
                    .catch((err) => res.json({ status: "erro", err }));
            }
            res.json({ status: "ok", res: maquinas });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});

module.exports = router;
