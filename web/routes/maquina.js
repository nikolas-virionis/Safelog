// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/cadastro", async (req, res, next) => {
    let { id, id_maquina, nome, senha, empresa } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
    id_maquina = id_maquina.replace("-", ":");
    let maquinaExiste = `SELECT * FROM maquina WHERE id_maquina = '${id_maquina}';`;
    let insertMaquina = `INSERT INTO maquina(id_maquina, nome, senha, fk_empresa) VALUES ('${id_maquina}', '${nome}', MD5('${senha}'), '${empresa}')`;
    let insertUsuarioMaquina = `INSERT INTO usuario_maquina(responsavel, fk_usuario, fk_maquina) VALUES ('s', ${id}, '${id_maquina}');`;
    await sequelize
        .query(maquinaExiste, { type: sequelize.QueryTypes.SELECT })
        .then(async (maquinas) => {
            if (maquinas.length == 0) {
                await sequelize
                    .query(insertMaquina, {
                        type: sequelize.QueryTypes.INSERT,
                    })
                    .then(async (response) => {
                        await sequelize
                            .query(insertUsuarioMaquina, {
                                type: sequelize.QueryTypes.INSERT,
                            })
                            .then((responsta) =>
                                res.json({
                                    status: "ok",
                                    msg: "Maquina registrada com sucesso",
                                })
                            )
                            .catch((err) =>
                                res.json({ status: "erro", msg: err })
                            );
                    })
                    .catch((err) => res.json({ status: "erro", msg: err }));
            } else res.json({ status: "erro", msg: "Maquina ja cadastrada" });
        })
        .catch((err) => res.json({ status: "erro", msg: err }));
});

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

router.post("/verificar-usuario", async (req, res) => {
    let { id, maquina } = req.body;
    let consulta = `SELECT * FROM usuario_maquina WHERE fk_usuario = ${id} AND fk_maquina = '${maquina}';`;

    await sequelize
        .query(consulta, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) =>
            res.json({
                status: "ok",
                msg: resposta,
            })
        )
        .catch((err) => res.json({ status: "erro", err }));
});

router.post("/componentes", async (req, res) => {
    let { id, componentes } = req.body;

    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    for (let componentes of componentes) {
    }
});

router.post("/lista-componentes", async (req, res) => {
    let { id } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let sql = `SELECT tipo, medicao_limite FROM categoria_medicao JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao AND fk_maquina = '${id}'`;

    await sequelize
        .query(sql, { type: sequelize.QueryTypes.SELECT })
        .then((response) => {
            res.json({ status: "ok", msg: response });
        })
        .catch((err) => {
            res.json({ status: "erro", msg: err });
        });
});
module.exports = router;
