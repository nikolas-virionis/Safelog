// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
let sendInvite = require("../util/cadastro-parcial/convite").enviarConvite;

router.post("/cadastro", async (req, res, next) => {
    let { id, nome, cidade, pais, email, staff } = req.body;

    let idExists = `SELECT * FROM empresa WHERE id_empresa = '${id}'`;
    let empresaExiste;
    await sequelize
        .query(idExists, { type: sequelize.QueryTypes.SELECT })
        .then((response) => (empresaExiste = response.length > 0));

    if (!empresaExiste) {
        let insertEmpresa = `INSERT INTO empresa(id_empresa, nome, cidade, pais, fk_staff) VALUES ('${id}', '${nome}', '${cidade}', '${pais}', ${staff})`;
        await sequelize
            .query(insertEmpresa, { type: sequelize.QueryTypes.INSERT })
            .then((response) => {
                sendInvite(email, "admin", id, null).then((result) => {
                    res.json(result);
                });
            })
            .catch((err) => console.error(err));
    } else res.json({ status: "error", msg: "Empresa ja cadastrada" });
});

module.exports = router;
