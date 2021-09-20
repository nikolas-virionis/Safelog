// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
let sendInvite = require("../util/cadastro-parcial/convite").enviarConvite;
const {
    updateDadosUsuario,
    criarFormasContato,
} = require("../util/cadastro-final/updateCadastro");
const { generateToken } = require("../util/token-user/script");
const { mandarEmail } = require("../util/email/email");

//rotas
router.post("/convite", async (req, res, next) => {
    // body da requisição post => dados principais da rota
    const { email, cargo, fk_empresa, fk_supervisor } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    sendInvite(email, cargo, fk_empresa, fk_supervisor)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => console.log(err));
});

router.post("/cadastro-final", async (req, res, next) => {
    const { id, nome, email, senha, contatos } = req.body;

    await updateDadosUsuario(id, nome, email, senha)
        .then((response) => console.log(response))
        .catch((err) => {
            console.log(err);
            res.json({
                status: "erro",
                msg: err,
            });
        });
    await criarFormasContato(id, contatos)
        .then((response) => console.log(response))
        .catch((err) => {
            console.log(err);
            res.json({
                status: "erro",
                msg: err,
            });
        });
    return res.json({
        status: "ok",
    });
});

router.post("/verificacao", async (req, res, next) => {
    let { email, token } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let verificarUsuario = `SELECT id_usuario FROM usuario WHERE email = '${email}' and token = '${token}';`;
    await sequelize
        .query(verificarUsuario, { type: sequelize.QueryTypes.SELECT })
        .then(([response]) => {
            if (response) res.json({ status: "ok", msg: response });
            else res.json({ status: "erro", msg: "email ou token invalidos" });
        });
});

router.post("/email-redefinir-senha", async (req, res, next) => {
    let { email } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
    let token = generateToken();
    let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${email}'`;
    await sequelize
        .query(updateToken, {
            type: sequelize.QueryTypes.UPDATE,
        })
        .then(async (resposta) => {
            let nomeUsuario = `SELECT nome FROM usuario WHERE email = '${email}'`;
            await sequelize
                .query(nomeUsuario, {
                    type: sequelize.QueryTypes.SELECT,
                })
                .then(([response]) =>
                    mandarEmail("redefinir", response.nome, email, [token])
                        .then((resp) =>
                            res.json({
                                status: "ok",
                                msg: "email de redefinição de senha enviado com sucesso",
                            })
                        )
                        .catch((err) => res.json({ status: "erro", msg: err }))
                );
        });
});

router.post("/redefinir-senha", async (req, res) => {
    let { email, senha } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let atualizarSenha = `UPDATE usuario SET senha = MD5('${senha}') WHERE email = '${email}'`;
    await sequelize
        .query(atualizarSenha, {
            type: sequelize.QueryTypes.UPDATE,
        })
        .then((response) => res.json({ status: "ok", msg: "senha atualizada" }))
        .catch((err) => res.json({ status: "erro", msg: err }));
});

router.post("/pessoas-dependentes", async (req, res) => {
    let { id } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
    let dependentes = `SELECT nome, email FROM usuario WHERE fk_supervisor = ${id}`;
    await sequelize
        .query(dependentes, { type: sequelize.QueryTypes.SELECT })
        .then((response) => res.json(response));
});
module.exports = router;
