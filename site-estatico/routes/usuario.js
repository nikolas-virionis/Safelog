// dependencias
let express = require("express");
let router = express.Router();
let sendInvite = require("../util/cadastro-parcial/convite").enviarConvite;

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

router.post("/convite", async (req, res, next) => {
    // body da requisição post => dados principais da rota
    const { email, cargo, fk_empresa, fk_supervisor, complementos } =
        req.body; 

    console.log(req.body);

    sendInvite(email, cargo, fk_empresa, fk_supervisor, complementos)
        .then(response => {
            console.log(response);
            res.json(response);
        })
        .catch(err => console.log(err))
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
