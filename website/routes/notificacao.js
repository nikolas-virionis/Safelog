// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/lista", async (req, res) => {
    let {idUsuario} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    const sql = `SELECT notificacao.*, usuario_notificacao.* FROM notificacao JOIN usuario_notificacao ON fk_notificacao = id_notificacao AND fk_usuario = ${idUsuario} ORDER BY data_notificacao DESC`;
    const sqlNaoLidos = `SELECT count(id_usuario_notificacao) as naoLidos FROM usuario_notificacao WHERE fk_usuario = ${idUsuario} AND lido = 'n'`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(async notificacoes => {
            await sequelize
                .query(sqlNaoLidos, {type: sequelize.QueryTypes.SELECT})
                .catch(async err => {
                    Promise.resolve(
                        await sequelizeAzure.query(sqlNaoLidos, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    );
                })
                .then(([{naoLidos}]) =>
                    res.json({status: "ok", msg: {notificacoes, naoLidos}})
                )
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/dados", async (req, res) => {
    let {idNotificacao} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    const sql = `SELECT notificacao.*, data_notificacao FROM notificacao JOIN usuario_notificacao ON id_notificacao = fk_notificacao WHERE id_notificacao = ${idNotificacao}`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(([notificacao]) => {
            res.json({status: "ok", msg: notificacao});
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/ler", async (req, res) => {
    let {idNotificacao, idUsuario} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }

    const sql = `UPDATE usuario_notificacao SET lido = 's' WHERE fk_notificacao = ${idNotificacao} AND fk_usuario = ${idUsuario}`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.UPDATE})
        .catch(async err => {
            Promise.resolve();
        })
        .then(async () => {
            await sequelize.query(sql, {type: sequelize.QueryTypes.UPDATE});
            Promise.resolve();
        })
        .then(() => res.json({status: "ok", msg: "Mensagem lida com sucesso"}))
        .catch(err => res.json({status: "erro", msg: err}));
});

module.exports = router;
