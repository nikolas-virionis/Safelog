// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
let { checarEmStaff, checarEmUsuario, gerarId, insertParcial } = require("../util/cadastro-parcial/convite")
let send = require("../util/cadastro-parcial/email").mandarEmail;

router.get("/cadastro", (req, res, next) =>
    res.redirect("/cadastro-pessoa.html")
);

router.post("/convite", async (req, res, next) => {
    const { email, cargo, fk_empresa, fk_supervisor, complementos } = req.body;

    if (checarEmStaff(email)) return res.status(403).send("Usuário já registrado como staff");
    if (checarEmUsuario(email)) return res.status(403).send("Usuário já registrado");
    // let sqlEmailExistsInStaff = `SELECT * FROM staff WHERE email = '${email}';`;
    // await sequelize
    //     .query(sqlEmailExistsInStaff, {
    //         type: sequelize.QueryTypes.SELECT,
    //     })
    //     .then((resposta) => {
    //         if (resposta.length > 0)
    //             return res.status(401).send("Usuário já registrado como staff");
    //     });

    // let sqlEmailExistsInUsuario = `SELECT * FROM usuario WHERE email = '${email}';`;
    // await sequelize
    //     .query(sqlEmailExistsInUsuario, {
    //         type: sequelize.QueryTypes.SELECT,
    //     })
    //     .then((resposta) => {
    //         if (resposta.length > 0)
    //             return res.status(401).send("Usuário já registrado");
    //     });
    // console.log("\n\nSQL3\n\n");

    // consultando existencia da hash no banco
    // let hash, hashesFound;
    // do {
    //     hash = generateId();
    //     let sqlHashExists = `SELECT * FROM usuario WHERE id_usuario = '${hash}' `;
    //     //
    //     await sequelize
    //         .query(sqlHashExists, {
    //             type: sequelize.QueryTypes.SELECT,
    //         })
    //         .then((response) => (hashesFound = response.length));
    // } while (hashesFound > 0);

    // let insertParcial = `INSERT INTO usuario(id_usuario, email, cargo, fk_empresa, fk_supervisor) VALUES ('${hash}', '${email}', '${cargo}', '${fk_empresa}', '${fk_supervisor}')`;
    // await sequelize
    //     .query(insertParcial, {
    //         type: sequelize.QueryTypes.INSERT,
    //     })
    //     .then((resposta) => res.json(resposta));
    let hash = gerarId();
    insertParcial(hash, email, cargo, fk_empresa, fk_supervisor)
    send("cadastro", undefined, complementos[0], email, complementos[1], [
        hash,
    ]);

    return res.json({
        status: "ok"
    })
});

module.exports = router;
