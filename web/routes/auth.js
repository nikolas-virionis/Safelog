// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

let env = process.env.NODE_ENV || "development";

// autenticação de staff user baseado em email e senha
router.post("/staff", (req, res, next) => {
    let { email, senha } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let sql = `SELECT * FROM staff WHERE email = '${email}' and senha = MD5('${senha}');`;

    //   query
    sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then(([result]) => {
            if (result) {
                let { id_staff: id, nome, email } = result;
                res.json({
                    status: "ok",
                    cargo: "staff",
                    id,
                    nome,
                    email,
                });
            } else
                res.json({ status: "erro", msg: "Email ou senha inválidos" });
        })
        .catch((err) => {
            res.json(err);
        });

    //   res.json({ email, senha });
});

// autenticação de usuário baseado no email e senha
router.post("/usuario", (req, res, next) => {
    let { email, senha } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });

    let sql = `SELECT * FROM usuario WHERE email = '${email}' and senha = MD5('${senha}');`;

    //   query
    sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then(([result]) => {
            if (result) {
                let {
                    id_usuario: id,
                    nome,
                    email,
                    cargo,
                    fk_empresa: id_empresa,
                    fk_supervisor: id_supervisor,
                } = result;

                res.json({
                    status: "ok",
                    cargo,
                    id,
                    nome,
                    email,
                    id_empresa,
                    id_supervisor,
                });
            } else
                res.json({ status: "erro", msg: "Email ou senha inválidos" });
        })
        .catch((err) => {
            res.json(err);
        });
});

router.post("/maquinas", (req, res) => {
    let { id, senha } = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição",
        });
});

module.exports = router;
