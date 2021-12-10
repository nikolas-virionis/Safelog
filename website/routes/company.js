// dependencias
let express = require("express");
let router = express.Router();
let {sequelize, sequelizeAzure} = require("../models");
let {enviarConvite: sendInvite} = require("../util/register/invite");

router.post("/cadastro", async (req, res, next) => {
    let {id, nome, cidade, pais, email, staff} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let idExists = `SELECT * FROM empresa WHERE id_empresa = '${id}'`;
    let empresaExiste;
    await sequelize
        .query(idExists, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            return Promise.resolve(
                await sequelizeAzure.query(idExists, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(response => (empresaExiste = response.length > 0))
        .catch(err => res.json({status: "erro", msg: err}));

    if (!empresaExiste) {
        let insertEmpresa = `INSERT INTO empresa(id_empresa, nome, cidade, pais, fk_staff) VALUES ('${id}', '${nome}', '${cidade}', '${pais}', ${staff})`;
        await sequelize
            .query(insertEmpresa, {type: sequelize.QueryTypes.INSERT})
            .catch(async err => {
                return Promise.resolve();
            })
            .then(async () => {
                await sequelizeAzure.query(insertEmpresa, {
                    type: sequelizeAzure.QueryTypes.INSERT
                });
                return Promise.resolve();
            })
            .then(() => {
                sendInvite(email, "admin", id, null)
                    .then(result => {
                        res.json(result);
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            })
            .catch(err => console.error(err));
    } else res.json({status: "alerta", msg: "Empresa ja cadastrada"});
});

module.exports = router;
