// dependencias
let express = require("express");
let router = express.Router();
const {
    updateDadosUsuario,
    criarFormasContato,
} = require("../util/cadastro-final/updateCadastro");
const {
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
    // body da requisição post => dados principais da rota
    const { email, cargo, fk_empresa, fk_supervisor, complementos } = req.body;
    if (!email) return res.status(403).send("body não fornecido na requisição");
    //checar se email existe em staff ou usuario
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then((bool) => (emStaff = bool));
    if (emStaff)
        return res.status(403).send("Usuário já registrado como staff");
    await checarEmUsuario(email).then((bool) => (emUsuario = bool));
    if (emUsuario) return res.status(403).send("Usuário já registrado");
    // geração do id unico
    let hash;
    await gerarId().then((id) => (hash = id));
    // insert parcial de dados
    await insertParcial(hash, email, cargo, fk_empresa, fk_supervisor);
    // email de cadastr enviado para
    await send("cadastro", undefined, complementos[0], email, complementos[1], [
        hash,
    ]);

    return res.json({
        status: "ok",
    });
});

router.post("/cadastro-final", async (req, res, next) => {
    const { id, nome, email, senha, contatos } = req.body;

    await updateDadosUsuario(id, nome, email, senha)
        .then((response) => console.log(response))
        .catch((err) => {
            console.log(err);
            res.json({
                status: "error",
                msg: err,
            });
        });
    await criarFormasContato(id, contatos)
        .then((response) => console.log(response))
        .catch((err) => {
            console.log(err);
            res.json({
                status: "error",
                msg: err,
            });
        });
    return res.json({
        status: "ok",
    });
});

module.exports = router;
