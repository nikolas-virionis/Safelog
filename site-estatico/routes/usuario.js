// dependencias
let express = require("express");
let router = express.Router();
let {
    checarEmStaff,
    checarEmUsuario,
    gerarId,
    insertParcial,
} = require("../util/cadastro-parcial/convite");
let send = require("../util/cadastro-parcial/email").mandarEmail;

router.get("/cadastro", (req, res, next) =>
    res.redirect("/cadastro-pessoa.html")
);

router.post("/convite", async (req, res, next) => {
    const { email, cargo, fk_empresa, fk_supervisor, complementos } = req.body;
    if (!email) return res.status(403).send("body não fornecido na requisição");
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then((bool) => (emStaff = bool));
    if (emStaff)
        return res.status(403).send("Usuário já registrado como staff");
    await checarEmUsuario(email).then((bool) => (emUsuario = bool));
    if (emUsuario) return res.status(403).send("Usuário já registrado");
    let hash;
    await gerarId().then((id) => (hash = id)); //hash = id
    await insertParcial(hash, email, cargo, fk_empresa, fk_supervisor);
    await send("cadastro", undefined, complementos[0], email, complementos[1], [
        hash,
    ]);

    return res.json({
        status: "ok",
    });
});

module.exports = router;
