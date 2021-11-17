// dependencias
let express = require("express");
let router = express.Router();
let {sequelize, sequelizeAzure} = require("../models");

let env = process.env.NODE_ENV || "development";

// autenticação de staff user baseado em email e senha
router.post("/staff", (req, res, next) => {
    let {email, senha} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    sequelize.authenticate()
    .then(() => {
        // querying on aws (MySQL)
        let sql = `SELECT * FROM staff WHERE email = '${email}' and senha = MD5('${senha}');`;

        sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(([result]) => {
            if (result) {
                let {id_staff: id, nome, email} = result;
                res.json({
                    status: "ok",
                    msg: "Usuario logado como staff",
                    cargo: "staff",
                    id,
                    nome,
                    email
                });
            } else
                res.json({status: "alerta", msg: "Email ou senha inválidos"});
        })
        .catch(err => {
            res.json(err);
        });
    })
    .catch(err => {
        // querying on azure (SQL SERVER)
        let sqlAzure = `SELECT * FROM staff WHERE email = '${email}' AND senha = HASHBYTES('MD5', '${senha}')`;

        sequelizeAzure
        .query(sqlAzure, {
            type: sequelizeAzure.QueryTypes.SELECT
        })
        .then(([result]) => {
            if (result) {
                let {id_staff: id, nome, email} = result;
                res.json({
                    status: "ok",
                    msg: "Usuario logado como staff",
                    cargo: "staff",
                    id,
                    nome,
                    email
                });
            } else
                res.json({status: "alerta", msg: "Email ou senha inválidos"});
        })
        .catch(err => {
            res.json(err);
        });
    })
});

// autenticação de usuário baseado no email e senha
router.post("/usuario", (req, res, next) => {
    let {email, senha} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    sequelize.authenticate()
    .then(() => {
        // querying on AWS (MySQL)
        let sql = `SELECT * FROM usuario WHERE email = '${email}' and senha = MD5('${senha}');`;

        sequelize
        .query(sql, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(([result]) => {
            if (result) {
                let {
                    id_usuario: id,
                    nome,
                    email,
                    cargo,
                    foto,
                    fk_empresa: id_empresa,
                    fk_supervisor: id_supervisor
                } = result;

                res.json({
                    status: "ok",
                    cargo,
                    id,
                    nome,
                    email,
                    foto,
                    id_empresa,
                    id_supervisor,
                    msg: "Usuario logado com sucesso"
                });
            } else
                res.json({status: "alerta", msg: "Email ou senha inválidos"});
        })
        .catch(err => {
            res.json(err);
        });
    })
    .catch(() => {
        // querying on Azure (SQL Server)
        let sqlAzure = `SELECT * FROM usuario WHERE email = '${email}' and senha = HASHBYTES('MD5', '${senha}');`;

        sequelizeAzure
        .query(sqlAzure, {
            type: sequelizeAzure.QueryTypes.SELECT
        })
        .then(([result]) => {
            if (result) {
                let {
                    id_usuario: id,
                    nome,
                    email,
                    cargo,
                    foto,
                    fk_empresa: id_empresa,
                    fk_supervisor: id_supervisor
                } = result;

                res.json({
                    status: "ok",
                    cargo,
                    id,
                    nome,
                    email,
                    foto,
                    id_empresa,
                    id_supervisor,
                    msg: "Usuario logado com sucesso"
                });
            } else
                res.json({status: "alerta", msg: "Email ou senha inválidos"});
        })
        .catch(err => {
            res.json(err);
        });
    });

});

router.post("/maquina", async (req, res) => {
    let {id, senha} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let sqlMaquina = `SELECT * FROM maquina WHERE id_maquina = '${id}'`;

    sequelize.authenticate()
    .then(() => {
        // querying on AWS (MySQL)
        let sqlSenha = `SELECT * FROM maquina WHERE id_maquina = '${id}' AND senha = MD5('${senha}')`;

        await sequelize
        .query(sqlMaquina, {type: sequelize.QueryTypes.SELECT})
        .then(async ([response]) => {
            if (response) {
                await sequelize
                    .query(sqlSenha, {type: sequelize.QueryTypes.SELECT})
                    .then(([response]) => {
                        if (response) {
                            res.json({
                                status: "ok",
                                msg: "Credenciais da maquina corretas"
                            });
                        } else {
                            res.json({
                                status: "alerta",
                                msg: "Senha incorreta"
                            });
                        }
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            } else {
                res.json({status: "alerta", msg: "Maquina não encontrada"});
            }
        })
        .catch(err => {
            res.json({status: "erro", msg: err});
        });
    })
    .catch(() => {
        // querying on Azure (SQL Server)
        let sqlSenhaAzure = `SELECT * FROM maquina WHERE id_maquina = '${id}' AND senha = HASHBYTES('MD5', '${senha}')`;

        await sequelizeAzure
        .query(sqlMaquina, {type: sequelizeAzure.QueryTypes.SELECT})
        .then(async ([response]) => {
            if (response) {
                await sequelizeAzure
                    .query(sqlSenhaAzure, {type: sequelizeAzure.QueryTypes.SELECT})
                    .then(([response]) => {
                        if (response) {
                            res.json({
                                status: "ok",
                                msg: "Credenciais da maquina corretas"
                            });
                        } else {
                            res.json({
                                status: "alerta",
                                msg: "Senha incorreta"
                            });
                        }
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            } else {
                res.json({status: "alerta", msg: "Maquina não encontrada"});
            }
        })
        .catch(err => {
            res.json({status: "erro", msg: err});
        });
    })
});

module.exports = router;
