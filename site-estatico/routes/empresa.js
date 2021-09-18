// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
const url = require("url");

router.post("/cadastro", async (req, res, next) => {
    let { id, nome, cidade, pais, email, staff, complementos } = req.body;

    let idExists = `SELECT * FROM empresa WHERE id_empresa = '${id}'`;
    let empresaExiste;
    await sequelize
        .query(idExists, { type: sequelize.QueryTypes.SELECT })
        .then((response) => (empresaExiste = response.length > 0));

    if (!empresaExiste) {
        let insertEmpresa = `INSERT INTO empresa(id_empresa, nome, cidade, pais, fk_staff) VALUES ('${id}', '${nome}', '${cidade}', '${pais}', ${staff})`;
        await sequelize
            .query(insertEmpresa, { type: sequelize.QueryTypes.INSERT })
            .catch((err) => console.error(err));
    }

    let query = {
        email,
        cargo: "admin",
        fk_empresa: id,
        fk_supervisor: null,
        complementos,
    };
    res.redirect(
        url.format({
            pathname: "/usuario/convite",
            method: "POST",
            query,
        })
    );
});

module.exports = router;
