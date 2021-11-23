// dependencias
let express = require("express");
let router = express.Router();
let {sequelize, sequelizeAzure} = require("../models");
const multer = require("multer");
express.json();

const {md5ToHashbytesMd5} = require("../util/azure-migration/encrypt");

const {
    enviarConvite: sendInvite,
    checarEmStaff,
    checarEmUsuario
} = require("../util/cadastro/convite");
const {
    updateDadosUsuario,
    criarFormasContato
} = require("../util/cadastro/updateCadastro");
const {generateToken} = require("../util/token-user/token");
const {mandarEmail} = require("../util/email/email");
const {deleteUsuario} = require("../util/delete-usuario/delete");
const {
    redirecionamentoAcessos
} = require("../util/acesso-maquina/escolhaAcesso");
const {deleteAcesso} = require("../util/acesso-maquina/deleteAcesso");
const {msg} = require("../util/notificacao/notificacao");
const {enviarNotificacao} = require("../util/notificacao/notificar");

//rotas
router.post("/convite", async (req, res, next) => {
    // body da requisição post => dados principais da rota
    const {email, cargo, fk_empresa, fk_supervisor} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    sendInvite(email, cargo, fk_empresa, fk_supervisor)
        .then(response => {
            res.json(response);
        })
        .catch(err => console.log(err));
});

router.post("/cadastro-final", async (req, res, next) => {
    const {id, nome, email, senha, contatos} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    await updateDadosUsuario(id, nome, email, senha)
        .then(async () => {
            criarFormasContato(id, contatos)
                .then(() => {
                    enviarNotificacao([id], {
                        tipo: "boas vindas",
                        msg: msg("boas vindas", nome)
                    })
                        .then(() =>
                            res.json({
                                status: "ok"
                            })
                        )
                        .catch(err => {
                            res.json({
                                status: "erro",
                                msg: err
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "erro",
                        msg: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "erro",
                msg: err
            });
        });
});

router.post("/pessoas-dependentes", async (req, res) => {
    let {id, search, main, order} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    let dependentes = `SELECT id_usuario, nome, email FROM usuario WHERE fk_supervisor = ${id} ${
        search
            ? ` AND email LIKE '%${search}%' OR fk_supervisor = ${id} AND nome LIKE '%${search}%'`
            : ""
    } ${main ? ` ORDER BY ${main} ${order}` : ""}`;
    await sequelize
        .query(dependentes, {type: sequelize.QueryTypes.SELECT})
        .catch(err => Promise.resolve())
        .then(response => res.json({status: "ok", res: response}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/perfil", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let sqlEmpresaSup = `SELECT s.nome AS supervisor, empresa.nome AS empresa FROM usuario AS f JOIN empresa ON fk_empresa = id_empresa JOIN usuario AS s ON f.fk_supervisor = s.id_usuario WHERE f.id_usuario = ${id};`;
    let sqlContatos = `SELECT forma_contato.nome, contato.valor FROM forma_contato JOIN contato ON fk_forma_contato = id_forma_contato JOIN usuario ON fk_usuario = id_usuario AND fk_usuario = ${id};`;

    await sequelize
        .query(sqlEmpresaSup, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(sqlEmpresaSup, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(([response]) => {
            sequelize
                .query(sqlContatos, {type: sequelize.QueryTypes.SELECT})
                .catch(async err => {
                    return Promise.resolve(
                        await sequelizeAzure.query(sqlContatos, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    );
                })

                .then(result => {
                    res.json({status: "ok", ...response, contatos: result});
                })
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/upload/user-profile/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage});

// upload de img
router.post(
    "/edita-foto",
    upload.single("profileImg"),
    async (req, res, next) => {
        let {userId} = req.body;
        let filename = req.file.filename;

        const sql = `UPDATE usuario SET foto = '${filename}' WHERE id_usuario = ${userId}`;

        sequelize
            .query(sql, {type: sequelize.QueryTypes.UPDATE})
            .then(response => {
                res.redirect(`/edita-perfil?update-pic=true&pic=${filename}`);
            })
            .catch(err => res.json({status: "erro", msg: err}));
    }
);

// edicao perfil
router.post("/edicao-perfil", async (req, res) => {
    let {id, nome, email, contatos} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    const updateDadosUsuario = `UPDATE usuario SET nome = '${nome}', email = '${email}' WHERE id_usuario = ${id};`;
    await sequelize
        .query(updateDadosUsuario, {
            type: sequelize.QueryTypes.UPDATE
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(updateDadosUsuario, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
            return Promise.resolve();
        })
        .then(async response => {
            for (let contato of contatos) {
                let {acao, valor, nome} = contato;
                if (acao == "insert") {
                    let sql = `SELECT id_contato FROM contato WHERE fk_usuario = ${id}`;
                    await sequelize
                        .query(sql, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .catch(async err =>
                            Promise.resolve(
                                await sequelizeAzure.query(sql, {
                                    type: sequelizeAzure.QueryTypes.SELECT
                                })
                            )
                        )
                        .then(async response => {
                            let sql = `INSERT INTO contato(fk_usuario, id_contato, valor, fk_forma_contato) VALUES (${id}, ${
                                response[response.length - 1].id_contato + 1
                            }, '${valor}', ${
                                nome == "whatsapp"
                                    ? 1
                                    : nome == "telegram"
                                    ? 2
                                    : 3
                            })`;
                            await sequelize
                                .query(sql, {
                                    type: sequelize.QueryTypes.INSERT
                                })
                                .catch(err => Promise.resolve())
                                .then(async () => {
                                    await sequelizeAzure.query(sql, {
                                        type: sequelizeAzure.QueryTypes.INSERT
                                    });
                                    return Promise.resolve();
                                })
                                .then(resposta => {})
                                .catch(err =>
                                    res.json({
                                        status: "erro",
                                        msg: "Erro no insert de forma de contato nova"
                                    })
                                );
                        });
                } else if (acao == "update") {
                    let sql = `UPDATE contato SET valor = '${valor}' WHERE fk_usuario = ${id} and fk_forma_contato = ${
                        nome == "whatsapp" ? 1 : nome == "telegram" ? 2 : 3
                    };`;
                    await sequelize
                        .query(sql, {
                            type: sequelize.QueryTypes.UPDATE
                        })
                        .catch(err => Promise.resolve())
                        .then(async () => {
                            await sequelizeAzure.query(sql, {
                                type: sequelizeAzure.QueryTypes.UPDATE
                            });
                            return Promise.resolve();
                        })
                        .then(resposta => {})
                        .catch(err =>
                            res.json({
                                status: "erro",
                                msg: "Erro no update de forma de contato"
                            })
                        );
                } else {
                    let sql = `DELETE FROM contato WHERE fk_usuario = ${id} and fk_forma_contato = ${
                        nome == "whatsapp" ? 1 : nome == "telegram" ? 2 : 3
                    }; `;
                    await sequelize
                        .query(sql, {
                            type: sequelize.QueryTypes.DELETE
                        })
                        .catch(err => Promise.resolve())
                        .then(async () => {
                            await sequelizeAzure.query(sql, {
                                type: sequelizeAzure.QueryTypes.DELETE
                            });
                            return Promise.resolve();
                        })
                        .then(resposta => {})
                        .catch(err =>
                            res.json({
                                status: "erro",
                                msg: "Erro no delete de forma de contato"
                            })
                        );
                }
            }
            res.json({
                status: "ok",
                msg: "Perfil do usuario editado com sucesso"
            });
        })
        .catch(err => res.json({status: "erro", msg: err}));
});
router.post("/email-redefinir-senha", async (req, res, next) => {
    let {email} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then(bool => (emStaff = bool));
    await checarEmUsuario(email).then(bool => (emUsuario = bool));
    if (!emUsuario && !emStaff)
        return res.json({
            status: "alerta",
            msg: "Usuário não registrado"
        });
    let tb;
    if (emStaff) tb = "staff";
    else tb = "usuario";
    let token = generateToken();
    let updateToken = `UPDATE ${tb} SET token = '${token}' WHERE email = '${email}'`;
    await sequelize
        .query(updateToken, {
            type: sequelize.QueryTypes.UPDATE
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure(updateToken, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
            return Promise.resolve();
        })
        .then(async resposta => {
            let nomeUsuario = `SELECT nome FROM ${tb} WHERE email = '${email}'`;
            await sequelize
                .query(nomeUsuario, {
                    type: sequelize.QueryTypes.SELECT
                })
                .catch(async err => {
                    return Promise.resolve(
                        await sequelizeAzure(nomeUsuario, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    );
                })
                .then(([response]) =>
                    mandarEmail("redefinir", response.nome, email, [token])
                        .then(resp =>
                            res.json({
                                status: "ok",
                                msg: "email de redefinição de senha enviado com sucesso"
                            })
                        )
                        .catch(err => res.json({status: "erro", msg: err}))
                )
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/redefinir-senha", async (req, res) => {
    let {senha, tb, id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    let checar;
    await eval(`checarEm${tb.charAt(0).toUpperCase() + tb.slice(1)}`)(id)
        .then(bool => (checar = bool))
        .catch(err => res.json({status: "erro", msg: err}));
    if (!checar)
        return res.json({
            status: "alerta",
            msg: "Usuario não pertencente à entidade informada"
        });
    let atualizarSenha = `UPDATE ${tb} SET senha = HASHBYTES('MD5', '${senha}') WHERE id_${tb} = '${id}'`;
    await sequelize
        .query(atualizarSenha, {
            type: sequelize.QueryTypes.UPDATE
        })
        .catch(err => Promise.resolve())
        .then(async () => {
            let atualizarSenhaAzure = md5ToHashbytesMd5(atualizarSenha);

            await sequelizeAzure(atualizarSenhaAzure, {
                type: sequelize.QueryTypes.UPDATE
            });

            return Promise.resolve();
        })
        .then(response => res.json({status: "ok", msg: "senha atualizada"}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/verificacao-senha-atual", async (req, res) => {
    let {id, senha} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let verificaSenha = `SELECT * FROM usuario WHERE id_usuario = ${id} and senha = MD5('${senha}');`;

    await sequelize
        .query(verificaSenha, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            return Promise.resolve(
                await sequelizeAzure(md5ToHashbytesMd5(verificaSenha), {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(async response => {
            if (response.length) {
                let {email, nome} = response[0];
                let token = generateToken();
                let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${email}'`;

                await sequelize
                    .query(updateToken, {
                        type: sequelize.QueryTypes.UPDATE
                    })
                    .catch(async err => {
                        await sequelizeAzure.query(updateToken, {
                            type: sequelizeAzure.QueryTypes.UPDATE
                        });
                        return Promise.resolve();
                    })
                    .then(async resposta => {
                        mandarEmail("redefinir", nome, email, [token]);
                        res.json({
                            status: "ok",
                            msg: "email de redefinição de senha enviado com sucesso"
                        });
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            } else {
                res.json({status: "alerta", msg: "Senha incorreta"});
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/acesso-maquina", async (req, res) => {
    let {id, maquina} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let acessoExiste = `SELECT * FROM usuario_maquina WHERE fk_usuario = '${id}' AND fk_maquina = (SELECT pk_maquina FROM maquina WHERE id_maquina = '${maquina}')`;

    await sequelize
        .query(acessoExiste, {type: sequelize.QueryTypes.SELECT})
        .catch(err => {
            Promise.resolve(
                sequelizeAzure(acessoExiste, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(async ([response]) => {
            if (response) {
                res.json({
                    status: "alerta",
                    msg: "Usuario ja possui acesso à maquina"
                });
            } else {
                let dadosUsuario = `SELECT nome FROM usuario WHERE id_usuario = '${id}'`;
                await sequelize
                    .query(dadosUsuario, {type: sequelize.QueryTypes.SELECT})
                    .catch(async err => {
                        return Promise.resolve(
                            await sequelizeAzure(dadosUsuario, {
                                type: sequelizeAzure.QueryTypes.SELECT
                            })
                        );
                    })
                    .then(async ([analista]) => {
                        let {nome: nomeUsuario} = analista;
                        let dados = `SELECT maquina.pk_maquina as pkMaq, maquina.nome as nomeMaquina, id_usuario, usuario.nome as nomeResp, usuario.email FROM maquina JOIN usuario_maquina ON fk_maquina = pk_maquina AND id_maquina = '${maquina}' JOIN usuario ON id_usuario = fk_usuario AND responsavel = 's';`;

                        await sequelize
                            .query(dados, {type: sequelize.QueryTypes.SELECT})
                            .catch(async err => {
                                return Promise.resolve(
                                    await sequelizeAzure(dados, {
                                        type: sequelizeAzure.QueryTypes.SELECT
                                    })
                                );
                            })
                            .then(
                                async ([
                                    {
                                        id_usuario,
                                        nomeResp,
                                        nomeMaquina,
                                        email: emailResp,
                                        pkMaq
                                    }
                                ]) => {
                                    let token = generateToken();
                                    let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${emailResp}'`;
                                    await sequelize
                                        .query(updateToken, {
                                            type: sequelize.QueryTypes.UPDATE
                                        })
                                        .catch(async err => {
                                            await sequelizeAzure(updateToken, {
                                                type: sequelize.QueryTypes
                                                    .UPDATE
                                            });
                                            return Promise.resolve();
                                        })
                                        .then(() => {
                                            mandarEmail(
                                                "acesso",
                                                nomeResp,
                                                emailResp,
                                                [
                                                    token,
                                                    nomeUsuario,
                                                    nomeMaquina,
                                                    id,
                                                    pkMaq
                                                ]
                                            )
                                                .then(async () => {
                                                    enviarNotificacao(
                                                        [{id_usuario}],
                                                        {
                                                            tipo: "acesso",
                                                            msg: msg(
                                                                "acesso",
                                                                nomeResp,
                                                                [
                                                                    token,
                                                                    nomeUsuario,
                                                                    nomeMaquina,
                                                                    id,
                                                                    pkMaq
                                                                ],
                                                                emailResp
                                                            )
                                                        }
                                                    ).then(() => {
                                                        res.json({
                                                            status: "ok",
                                                            msg: "Email de permissão de acesso enviado"
                                                        });
                                                    });
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        status: "erro",
                                                        msg: err
                                                    });
                                                });
                                        })
                                        .catch(err =>
                                            res.json({status: "erro", msg: err})
                                        );
                                }
                            )
                            .catch(err => res.json({status: "erro", msg: err}));
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/verificacao", async (req, res, next) => {
    let {email, token} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let verificarUsuario = `SELECT id_usuario FROM usuario WHERE email = '${email}' and token = '${token}';`;
    await sequelize
        .query(verificarUsuario, {type: sequelize.QueryTypes.SELECT})
        .catch(async error =>
            Promise.resolve(
                await sequelizeAzure.query(verificarUsuario, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async ([response]) => {
            if (response)
                res.json({status: "ok", msg: response, user: "usuario"});
            else {
                let verificarStaff = `SELECT id_staff FROM staff WHERE email = '${email}' and token = '${token}';`;
                await sequelize
                    .query(verificarStaff, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .catch(async error =>
                        Promise.resolve(
                            await sequelizeAzure.query(verificarStaff, {
                                type: sequelizeAzure.QueryTypes.SELECT
                            })
                        )
                    )
                    .then(resposta => {
                        if (resposta?.msg)
                            res.json({
                                status: "ok",
                                msg: resposta,
                                user: "staff"
                            });
                        else
                            res.json({
                                status: "alerta",
                                msg: "email ou token invalidos"
                            });
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/delete", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body) {
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    }
    // ordem de delete
    // contato -> usuario_maquina -> usuario

    // formato de deletes
    let deletar = true;
    let usuarioResponsavel = `SELECT fk_maquina FROM usuario_maquina WHERE fk_usuario = ${id} AND responsavel = 's'`;
    await sequelize
        .query(usuarioResponsavel, {
            type: sequelize.QueryTypes.SELECT
        })
        .catch(async error =>
            Promise.resolve(
                await sequelizeAzure.query(usuarioResponsavel, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async usuarioResponsavel => {
            console.log(usuarioResponsavel);
            if (!usuarioResponsavel.length) {
                return deleteUsuario(id).then(response => {
                    res.json(response);
                });
            }

            usuarioResponsavel = usuarioResponsavel.map(el => el?.fk_maquina);
            console.log(usuarioResponsavel);
            for (let maq of usuarioResponsavel) {
                let sql = `SELECT fk_usuario FROM usuario_maquina WHERE fk_maquina = ${maq} AND responsavel = 'n'`;
                await sequelize
                    .query(sql, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .catch(async error =>
                        Promise.resolve(
                            await sequelizeAzure.query(sql, {
                                type: sequelizeAzure.QueryTypes.SELECT
                            })
                        )
                    )
                    .then(async resposta => {
                        redirecionamentoAcessos(
                            id,
                            maq,
                            resposta,
                            "atribuir responsavel"
                        )
                            .then(del => {
                                deletar = del;
                            })
                            .catch(err => res.json({status: "erro", msg: err}));
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            }
            if (deletar) {
                deleteUsuario(id)
                    .then(response => {
                        console.log(response);
                        res.json(response);
                    })
                    .catch(err => res.json({status: "erro", msg: err}));
            } else {
                res.json({
                    status: "ok",
                    msg: "Usuario é o único responsavel de uma maquina"
                });
            }
        });
});

router.post("/remocao-acesso", async (req, res) => {
    let {id, maquina} = req.body;
    if (!req.body) {
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    }
    let selectUsuario = `SELECT nome, email FROM usuario WHERE id_usuario = ${id}`;
    let selectDados = `SELECT usuario.nome as responsavel, maquina.nome as nomeMaquina FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${maquina}`;
    let deleteAcesso = `DELETE FROM usuario_maquina WHERE fk_usuario = ${id} AND fk_maquina = ${maquina}`;

    await sequelize
        .query(selectDados, {type: sequelize.QueryTypes.SELECT})
        .catch(async error =>
            Promise.resolve(
                await sequelizeAzure.query(selectDados, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async ([{responsavel, nomeMaquina}]) => {
            await sequelize
                .query(selectUsuario, {type: sequelize.QueryTypes.SELECT})
                .catch(async error =>
                    Promise.resolve(
                        await sequelizeAzure.query(selectUsuario, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(async ([{nome, email}]) => {
                    await sequelize
                        .query(deleteAcesso, {
                            type: sequelize.QueryTypes.DELETE
                        })
                        .catch(err => Promise.resolve())
                        .then(async error => {
                            await sequelizeAzure.query(deleteAcesso, {
                                type: sequelizeAzure.QueryTypes.DELETE
                            });
                            Promise.resolve();
                        })
                        .then(async () => {
                            mandarEmail(
                                "notificacao remocao acesso",
                                nome,
                                email,
                                [nomeMaquina, responsavel]
                            )
                                .then(() => {
                                    enviarNotificacao([{id_usuario: id}], {
                                        tipo: "notificacao remocao acesso",
                                        msg: msg(
                                            "notificacao remocao acesso",
                                            nome,
                                            [nomeMaquina, responsavel],
                                            email
                                        )
                                    }).then(() => {
                                        res.json({
                                            status: "ok",
                                            msg: "Acesso do usuario removido com sucesso"
                                        });
                                    });
                                })
                                .catch(err => {
                                    res.json({status: "erro", msg: err});
                                });
                        })
                        .catch(err => {
                            res.json({status: "erro", msg: err});
                        });
                })
                .catch(err => {
                    res.json({status: "erro", msg: err});
                });
        })
        .catch(err => {
            res.json({status: "erro", msg: err});
        });
});

router.post("/transferencia-responsavel", async (req, res) => {
    let {email, maquina, del, delType} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let usuarioResponsavel = `SELECT email as emailResp FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND responsavel = 's' AND fk_maquina = ${maquina}`;
    let usuarioExisteEmStaff = `SELECT * from staff WHERE email = '${email}'`;
    let usuarioExisteEmUsuario = `SELECT cargo, id_usuario from usuario WHERE email = '${email}'`;
    await sequelize
        .query(usuarioExisteEmStaff, {
            type: sequelize.QueryTypes.SELECT
        })
        .catch(async error =>
            Promise.resolve(
                await sequelizeAzure.query(usuarioExisteEmStaff, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async ([response]) => {
            if (response)
                return res.json({
                    status: "alerta",
                    msg: "Usuario cadastrado como staff"
                });
            await sequelize
                .query(usuarioExisteEmUsuario, {
                    type: sequelize.QueryTypes.SELECT
                })
                .catch(async error =>
                    Promise.resolve(
                        await sequelizeAzure.query(usuarioExisteEmUsuario, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(async ([usuario]) => {
                    if (!usuario)
                        return res.json({
                            status: "alerta",
                            msg: "Usuario não cadastrado"
                        });
                    if (usuario.cargo == "gestor")
                        return res.json({
                            status: "alerta",
                            msg: "Usuario cadastrado como gestor"
                        });

                    await sequelize
                        .query(usuarioResponsavel, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .catch(async error =>
                            Promise.resolve(
                                await sequelizeAzure.query(usuarioResponsavel, {
                                    type: sequelizeAzure.QueryTypes.SELECT
                                })
                            )
                        )
                        .then(async ([{emailResp}]) => {
                            if (email == emailResp)
                                res.json({
                                    status: "alerta",
                                    msg: "Usuario já é o responsável pela máquina"
                                });

                            if (del) {
                                let sql = `SELECT id_usuario as id FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_maquina = ${maquina} AND responsavel = 's'`;
                                await sequelize
                                    .query(sql, {
                                        type: sequelize.QueryTypes.SELECT
                                    })
                                    .catch(async error =>
                                        Promise.resolve(
                                            await sequelizeAzure.query(sql, {
                                                type: sequelizeAzure.QueryTypes
                                                    .SELECT
                                            })
                                        )
                                    )
                                    .then(([{id}]) => {
                                        deleteUsuario(id).catch(err => {
                                            res.json({
                                                status: "erro1",
                                                msg: err
                                            });
                                        });
                                    })
                                    .catch(err => {
                                        res.json({
                                            status: "erro2",
                                            msg: err
                                        });
                                    });
                            } else {
                                if (delType) {
                                    let sql = `DELETE FROM usuario_maquina WHERE fk_maquina = ${maquina} AND responsavel = 's'`;
                                    await sequelize
                                        .query(sql, {
                                            type: sequelize.QueryTypes.DELETE
                                        })
                                        .catch(err => Promise.resolve())
                                        .then(async () => {
                                            await sequelizeAzure.query(sql, {
                                                type: sequelizeAzure.QueryTypes
                                                    .DELETE
                                            });

                                            return Promise.resolve();
                                        })
                                        .catch(err => {
                                            res.json({
                                                status: "erro13",
                                                msg: err
                                            });
                                        });
                                } else {
                                    let sql = `UPDATE usuario_maquina SET responsavel = 'n' WHERE fk_maquina = ${maquina} AND responsavel = 's'`;
                                    await sequelize
                                        .query(sql, {
                                            type: sequelize.QueryTypes.UPDATE
                                        })
                                        .catch(err => Promise.resolve())
                                        .then(async () => {
                                            await sequelizeAzure.query(sql, {
                                                type: sequelizeAzure.QueryTypes
                                                    .UPDATE
                                            });
                                            return Promise.resolve();
                                        })
                                        .catch(err => {
                                            res.json({
                                                status: "erro3",
                                                msg: err
                                            });
                                        });
                                }
                            }
                            let selectUsuario = `SELECT id_usuario as id FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_maquina = ${maquina} AND id_usuario = (SELECT id_usuario FROM usuario WHERE email = '${email}')`;
                            await sequelize
                                .query(selectUsuario, {
                                    type: sequelize.QueryTypes.SELECT
                                })
                                .catch(async error =>
                                    Promise.resolve(
                                        await sequelizeAzure.query(
                                            selectUsuario,
                                            {
                                                type: sequelizeAzure.QueryTypes
                                                    .SELECT
                                            }
                                        )
                                    )
                                )
                                .then(async ([response]) => {
                                    if (response) {
                                        let updateResp = `UPDATE usuario_maquina SET responsavel = 's' WHERE fk_maquina = ${maquina} AND fk_usuario = ${response.id}`;
                                        await sequelize
                                            .query(updateResp, {
                                                type: sequelize.QueryTypes
                                                    .UPDATE
                                            })
                                            .catch(err => Promise.resolve())
                                            .then(async () => {
                                                await sequelizeAzure.query(
                                                    updateResp,
                                                    {
                                                        type: sequelizeAzure
                                                            .QueryTypes.UPDATE
                                                    }
                                                );
                                                return Promise.resolve();
                                            })
                                            .catch(err => {
                                                res.json({
                                                    status: "erro4",
                                                    msg: err
                                                });
                                            });
                                    } else {
                                        let insertResp = `INSERT INTO usuario_maquina(responsavel, fk_usuario, fk_maquina) VALUES ('s', (SELECT id_usuario FROM usuario WHERE email = '${email}'), ${maquina})`;
                                        await sequelize
                                            .query(insertResp, {
                                                type: sequelize.QueryTypes
                                                    .INSERT
                                            })
                                            .catch(err => Promise.resolve())
                                            .then(async () => {
                                                await sequelizeAzure.query(
                                                    insertResp,
                                                    {
                                                        type: sequelizeAzure
                                                            .QueryTypes.INSERT
                                                    }
                                                );

                                                return Promise.resolve();
                                            })
                                            .catch(err => {
                                                res.json({
                                                    status: "erro5",
                                                    msg: err
                                                });
                                            });
                                    }
                                    let selectResp = `SELECT id_usuario as id, usuario.nome as nome, maquina.nome as maq FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario JOIN maquina ON fk_maquina = pk_maquina AND fk_maquina = ${maquina} WHERE email = '${email}'`;
                                    await sequelize
                                        .query(selectResp, {
                                            type: sequelize.QueryTypes.SELECT
                                        })
                                        .catch(async error =>
                                            Promise.resolve(
                                                await sequelizeAzure.query(
                                                    selectResp,
                                                    {
                                                        type: sequelizeAzure
                                                            .QueryTypes.SELECT
                                                    }
                                                )
                                            )
                                        )
                                        .then(([{id, nome, maq}]) => {
                                            mandarEmail(
                                                "convite responsavel",
                                                nome,
                                                email,
                                                [maq]
                                            )
                                                .then(() => {
                                                    // notify
                                                    enviarNotificacao([id], {
                                                        tipo: "convite responsavel",
                                                        msg: msg(
                                                            "convite responsavel",
                                                            nome,
                                                            [maq]
                                                        )
                                                    }).then(() => {
                                                        res.json({
                                                            status: "ok",
                                                            msg: "Permissão de usuário transferida com sucesso"
                                                        });
                                                    });
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        status: "erro6",
                                                        msg: err
                                                    });
                                                });
                                        });
                                })
                                .catch(err => {
                                    res.json({
                                        status: "erro7",
                                        msg: err
                                    });
                                });
                        })
                        .catch(err => {
                            res.json({status: "erro8", msg: err});
                        });
                })
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});
router.post("/dados", async (req, res) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let sql = `SELECT id_usuario as id, nome, email, cargo, fk_empresa as id_empresa, fk_supervisor as id_supervisor FROM usuario WHERE id_usuario = ${id}`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(([usuario]) => res.json({status: "ok", msg: usuario}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/permissao-acesso", async (req, res) => {
    let {id, pk_maquina} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let sql = `INSERT INTO usuario_maquina(responsavel, fk_usuario, fk_maquina) VALUES ('n', ${id}, ${pk_maquina})`;
    let selectUsuario = `SELECT nome, email FROM usuario WHERE id_usuario = ${id}`;
    let selectDados = `SELECT usuario.nome as responsavel, maquina.nome as nomeMaquina FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${pk_maquina}`;
    await sequelize
        .query(sql, {type: sequelize.QueryTypes.INSERT})
        .catch(err => Promise.resolve())
        .then(async () => {
            await sequelizeAzure.query(sql, {
                type: sequelizeAzure.QueryTypes.INSERT
            });

            return Promise.resolve();
        })
        .then(async () => {
            await sequelize
                .query(selectUsuario, {type: sequelize.QueryTypes.SELECT})
                .catch(async err =>
                    Promise.resolve(
                        await sequelizeAzure.query(selectUsuario, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(async ([{nome, email}]) => {
                    await sequelize
                        .query(selectDados, {type: sequelize.QueryTypes.SELECT})
                        .catch(async err =>
                            Promise.resolve(
                                await sequelizeAzure.query(selectDados, {
                                    type: sequelizeAzure.QueryTypes.SELECT
                                })
                            )
                        )
                        .then(([{responsavel, nomeMaquina}]) => {
                            mandarEmail("notificacao acesso", nome, email, [
                                nomeMaquina,
                                responsavel
                            ])
                                .then(() => {
                                    enviarNotificacao([{id_usuario: id}], {
                                        tipo: "notificacao acesso",
                                        msg: msg(
                                            "notificacao acesso",
                                            nome,
                                            [nomeMaquina, responsavel],
                                            email
                                        )
                                    }).then(() => {
                                        res.json({
                                            status: "ok",
                                            msg: "Email de notificação enviado com sucesso"
                                        });
                                    });
                                })
                                .catch(err =>
                                    res.json({status: "erro", msg: err})
                                );
                        })
                        .catch(err => res.json({status: "erro", msg: err}));
                })
                .catch(err => res.json({status: "erro", msg: err}));
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/remocao-proprio-acesso", async (req, res) => {
    let {id, maquina} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let selectUsuario = `SELECT count(fk_usuario) as resp FROM usuario_maquina WHERE fk_maquina = ${maquina} AND fk_usuario = ${id} AND responsavel = 's'`;
    await sequelize
        .query(selectUsuario, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(selectUsuario, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async ([{resp}]) => {
            if (resp) {
                let acessosMaquina = `SELECT fk_usuario FROM usuario_maquina WHERE fk_maquina = ${maquina} AND responsavel = 'n'`;
                await sequelize
                    .query(acessosMaquina, {type: sequelize.QueryTypes.SELECT})
                    .catch(async err =>
                        Promise.resolve(
                            await sequelizeAzure.query(selectUsuario, {
                                type: sequelizeAzure.QueryTypes.SELECT
                            })
                        )
                    )
                    .then(resposta => {
                        redirecionamentoAcessos(
                            id,
                            maquina,
                            resposta,
                            "convidar responsavel"
                        ).then(del => {
                            if (del) {
                                deleteAcesso(id, maquina)
                                    .then(response => res.json(response))
                                    .catch(err =>
                                        res.json({
                                            status: "erro4",
                                            msg: err
                                        })
                                    );
                            } else {
                                res.json({
                                    status: "alerta",
                                    msg: "Acesso à máquina poderá ser removido a partir da transferencia de responsabilidade"
                                });
                            }
                        });
                    });
            } else {
                deleteAcesso(id, maquina)
                    .then(response => res.json(response))
                    .catch(err => res.json({status: "erro2", msg: err}));
            }
        })
        .catch(err => {
            res.json({status: "erro1", msg: err});
        });
});

module.exports = router;
