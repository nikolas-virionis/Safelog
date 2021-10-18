// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
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

//rotas
router.post("/convite", async (req, res, next) => {
    // body da requisição post => dados principais da rota
    const {email, cargo, fk_empresa, fk_supervisor} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
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
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    await updateDadosUsuario(id, nome, email, senha)
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
            res.json({
                status: "erro",
                msg: err
            });
        });
    await criarFormasContato(id, contatos)
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
            res.json({
                status: "erro",
                msg: err
            });
        });
    return res.json({
        status: "ok"
    });
});

router.post("/pessoas-dependentes", async (req, res) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    let dependentes = `SELECT id_usuario, nome, email FROM usuario WHERE fk_supervisor = ${id}`;
    await sequelize
        .query(dependentes, {type: sequelize.QueryTypes.SELECT})
        .then(response => res.json({status: "ok", res: response}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/perfil", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let sqlEmpresaSup = `SELECT s.nome AS supervisor, empresa.nome AS empresa FROM usuario AS f JOIN empresa ON fk_empresa = id_empresa JOIN usuario AS s ON f.fk_supervisor = s.id_usuario WHERE f.id_usuario = ${id};`;
    let sqlContatos = `SELECT forma_contato.nome, contato.valor FROM forma_contato JOIN contato ON fk_forma_contato = id_forma_contato JOIN usuario ON fk_usuario = id_usuario AND fk_usuario = ${id};`;

    await sequelize
        .query(sqlEmpresaSup, {type: sequelize.QueryTypes.SELECT})
        .then(([response]) => {
            sequelize
                .query(sqlContatos, {type: sequelize.QueryTypes.SELECT})
                .then(result => {
                    res.json({status: "ok", ...response, contatos: result});
                });
        });
});

router.post("/edicao-perfil", async (req, res) => {
    let {id, nome, email, contatos} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    const updateDadosUsuario = `UPDATE usuario SET nome = '${nome}', email = '${email}' WHERE id_usuario = ${id};`;
    await sequelize
        .query(updateDadosUsuario, {
            type: sequelize.QueryTypes.UPDATE
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
                        .then(async response => {
                            let sql = `INSERT INTO contato VALUES (${id}, ${
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
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then(bool => (emStaff = bool));
    await checarEmUsuario(email).then(bool => (emUsuario = bool));
    if (!emUsuario && !emStaff)
        return res.json({
            status: "erro",
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
        .then(async resposta => {
            let nomeUsuario = `SELECT nome FROM ${tb} WHERE email = '${email}'`;
            await sequelize
                .query(nomeUsuario, {
                    type: sequelize.QueryTypes.SELECT
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
                );
        });
});

router.post("/redefinir-senha", async (req, res) => {
    let {senha, tb, id} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    let checar;
    await eval(`checarEm${tb.charAt(0).toUpperCase() + tb.slice(1)}`)(id).then(
        bool => (checar = bool)
    );
    if (!checar)
        return res.json({
            status: "erro",
            msg: "Usuario não pertencente à entidade informada"
        });
    let atualizarSenha = `UPDATE ${tb} SET senha = MD5('${senha}') WHERE id_${tb} = '${id}'`;
    await sequelize
        .query(atualizarSenha, {
            type: sequelize.QueryTypes.UPDATE
        })
        .then(response => res.json({status: "ok", msg: "senha atualizada"}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/verificacao-senha-atual", async (req, res) => {
    let {id, senha} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let verificaSenha = `SELECT * FROM usuario WHERE id_usuario = ${id} and senha = MD5('${senha}');`;
    await sequelize
        .query(verificaSenha, {type: sequelize.QueryTypes.SELECT})
        .then(async response => {
            if (response.length) {
                let {email, nome} = response[0];
                let token = generateToken();
                let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${email}'`;
                await sequelize
                    .query(updateToken, {
                        type: sequelize.QueryTypes.UPDATE
                    })
                    .then(async resposta => {
                        mandarEmail("redefinir", nome, email, [token]);
                        res.json({
                            status: "ok",
                            msg: "email de redefinição de senha enviado com sucesso"
                        });
                    });
                res.json({status: "ok", msg: "Senha correta"});
            } else {
                res.json({status: "erro", msg: "Senha incorreta"});
            }
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/acesso-maquina", async (req, res) => {
    let {id, maquina} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let acessoExiste = `SELECT * FROM usuario_maquina WHERE fk_usuario = '${id}' AND fk_maquina = (SELECT pk_maquina FROM maquina WHERE id_maquina = '${maquina}')`;

    await sequelize
        .query(acessoExiste, {type: sequelize.QueryTypes.SELECT})
        .then(async ([response]) => {
            if (response) {
                res.json({
                    status: "erro",
                    msg: "Usuario ja possui acesso à maquina"
                });
            } else {
                let dadosUsuario = `SELECT nome FROM usuario WHERE id_usuario = '${id}'`;
                await sequelize
                    .query(dadosUsuario, {type: sequelize.QueryTypes.SELECT})
                    .then(async ([analista]) => {
                        let {nome: nomeUsuario} = analista;
                        let dados = `SELECT maquina.pk_maquina as pkMaq, maquina.nome as nomeMaquina, usuario.nome as nomeResp, usuario.email FROM maquina JOIN usuario_maquina ON fk_maquina = pk_maquina AND id_maquina = '${maquina}' JOIN usuario ON id_usuario = fk_usuario AND responsavel = 's';`;

                        await sequelize
                            .query(dados, {type: sequelize.QueryTypes.SELECT})
                            .then(async ([resposta]) => {
                                let {
                                    nomeResp,
                                    nomeMaquina,
                                    email: emailResp,
                                    pkMaq
                                } = resposta;
                                let token = generateToken();
                                let updateToken = `UPDATE usuario SET token = '${token}' WHERE email = '${emailResp}'`;
                                await sequelize
                                    .query(updateToken, {
                                        type: sequelize.QueryTypes.UPDATE
                                    })
                                    .then(update => {
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
                                            .then(() => {
                                                res.json({
                                                    status: "ok",
                                                    msg: "Email de permissão de acesso enviado"
                                                });
                                            })
                                            .catch(err => {
                                                res.json({
                                                    status: "erro",
                                                    msg: err
                                                });
                                            });
                                    });
                            });
                    });
            }
        });
});

router.post("/verificacao", async (req, res, next) => {
    let {email, token} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let verificarUsuario = `SELECT id_usuario FROM usuario WHERE email = '${email}' and token = '${token}';`;
    await sequelize
        .query(verificarUsuario, {type: sequelize.QueryTypes.SELECT})
        .then(async ([response]) => {
            if (response)
                res.json({status: "ok", msg: response, user: "usuario"});
            else {
                let verificarStaff = `SELECT id_staff FROM staff WHERE email = '${email}' and token = '${token}';`;
                await sequelize
                    .query(verificarStaff, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(resposta => {
                        if (resposta?.msg)
                            res.json({
                                status: "ok",
                                msg: resposta,
                                user: "staff"
                            });
                        else
                            res.json({
                                status: "erro",
                                msg: "email ou token invalidos"
                            });
                    });
            }
        });
});

router.post("/delete", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    // ordem de delete
    // contato -> usuario_maquina -> usuario

    // formato de deletes
    let deletar = true;
    const setFalse = () => {
        deletar = false;
        console.log("\n\n", {deletar}, "\n\n");
    };
    let usuarioResponsavel = `SELECT fk_maquina FROM usuario_maquina WHERE fk_usuario = ${id} AND responsavel = 's'`;
    await sequelize
        .query(usuarioResponsavel, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(async usuarioResponsavel => {
            if (usuarioResponsavel.length > 0) {
                usuarioResponsavel = usuarioResponsavel.map(
                    el => el?.fk_maquina
                );
                for (let maq of usuarioResponsavel) {
                    let sql = `SELECT fk_usuario FROM usuario_maquina WHERE fk_maquina = ${maq} AND responsavel = 'n'`;
                    await sequelize
                        .query(sql, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(async resposta => {
                            resposta = resposta.map(el => el?.fk_usuario);
                            if (resposta.length == 0) {
                                setFalse();
                                //reatribuição de responsavel
                                console.log("\n\n0 pessoas\n\n");
                                let sql = `SELECT g.nome as nomeGestor, g.email, a.nome, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = id_maquina AND id_maquina = '${maq}'`;
                                await sequelize
                                    .query(sql, {
                                        type: sequelize.QueryTypes.SELECT
                                    })
                                    .then(
                                        ([
                                            {
                                                nome,
                                                nomeMaquina,
                                                nomeGestor,
                                                email
                                            }
                                        ]) => {
                                            console.log("\n\nantes email\n\n");
                                            mandarEmail(
                                                "atribuir responsavel",
                                                nomeGestor,
                                                email,
                                                [nome, nomeMaquina]
                                            )
                                                .then(() => {
                                                    console.log(
                                                        "\n\ndps email"
                                                    );
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        status: "erro",
                                                        msg: err
                                                    });
                                                });
                                        }
                                    )
                                    .catch(err => {
                                        res.json({
                                            status: "erro",
                                            err
                                        });
                                    });
                            } else if (resposta.length == 1) {
                                console.log("\n\n1 pessoa\n\n");
                                //redefinição automática de responsavel
                                let updateResponsavel = `UPDATE usuario_maquina SET responsavel = 's' WHERE fk_maquina = ${maq} AND fk_usuario = ${resposta[0]}`;

                                await sequelize
                                    .query(updateResponsavel, {
                                        type: sequelize.QueryTypes.UPDATE
                                    })
                                    .catch(err => {
                                        res.json({
                                            status: "erro",
                                            err
                                        });
                                    });
                            } else {
                                //redefinição de responsavel
                                console.log("\n\nvarias pessoas\n\n");
                                let sql = `SELECT g.nome as nomeGestor, g.email, a.nome, maquina.nome as nomeMaquina FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario JOIN usuario_maquina ON a.id_usuario = fk_usuario AND a.id_usuario = ${id} JOIN maquina ON fk_maquina = id_maquina AND id_maquina = '${maq}'`;
                                await sequelize
                                    .query(sql, {
                                        type: sequelize.QueryTypes.SELECT
                                    })
                                    .then(
                                        ([
                                            {
                                                nome,
                                                nomeMaquina,
                                                nomeGestor,
                                                email
                                            }
                                        ]) => {
                                            mandarEmail(
                                                "redefinir responsavel",
                                                nomeGestor,
                                                email,
                                                [nome, nomeMaquina]
                                            ).catch(err => {
                                                res.json({
                                                    status: "erro",
                                                    msg: err
                                                });
                                            });
                                        }
                                    )
                                    .catch(err => {
                                        res.json({
                                            status: "erro",
                                            msg: err
                                        });
                                    });
                            }
                        })
                        .catch(err => {
                            res.json({
                                status: "erro",
                                msg: err
                            });
                        });
                }
                // res.json({ deletar });
                if (deletar) {
                    deleteUsuario(id)
                        .then(response => {
                            res.json(response);
                        })
                        .catch(err => {
                            res.json({
                                status: "erro",
                                msg: err
                            });
                        });
                } else {
                    res.json({
                        status: "ok",
                        msg: "Usuario é o único responsavel de uma maquina"
                    });
                }
            } else {
                deleteUsuario(id)
                    .then(response => {
                        res.json(response);
                    })
                    .catch(err => {
                        res.json({status: "erro", msg: err});
                    });
            }
        })
        .catch(err => {
            res.json({status: "erro", msg: err});
        });
});

router.post("/remocao-acesso", async (req, res) => {
    let {id, maquina} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    let selectUsuario = `SELECT nome, email FROM usuario WHERE id_usuario = ${id}`;
    let selectDados = `SELECT usuario.nome as responsavel, maquina.nome as nomeMaquina FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${maquina}`;
    let deleteAcesso = `DELETE FROM usuario_maquina WHERE fk_usuario = ${id} AND fk_maquina = ${maquina}`;

    await sequelize
        .query(selectDados, {type: sequelize.QueryTypes.SELECT})
        .then(async ([{responsavel, nomeMaquina}]) => {
            await sequelize
                .query(selectUsuario, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{nome, email}]) => {
                    await sequelize
                        .query(deleteAcesso, {
                            type: sequelize.QueryTypes.DELETE
                        })
                        .then(() => {
                            mandarEmail(
                                "notificacao remocao acesso",
                                nome,
                                email,
                                [nomeMaquina, responsavel]
                            )
                                .then(() => {
                                    res.json({
                                        status: "ok",
                                        msg: "Acesso do usuario removido com sucesso"
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
    let {email, maquina, del} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let usuarioResponsavel = `SELECT email as emailResp FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND responsavel = 's' AND fk_maquina = ${maquina}`;
    let usuarioExisteEmStaff = `SELECT * from staff WHERE email = '${email}'`;
    let usuarioExisteEmUsuario = `SELECT cargo from usuario WHERE email = '${email}'`;
    await sequelize
        .query(usuarioExisteEmStaff, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(async ([response]) => {
            if (response) {
                return res.json({
                    status: "erro",
                    msg: "Usuario cadastrado como staff"
                });
            } else {
                await sequelize
                    .query(usuarioExisteEmUsuario, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(async ([usuario]) => {
                        if (!usuario) {
                            return res.json({
                                status: "erro",
                                msg: "Usuario não cadastrado"
                            });
                        } else if (usuario.cargo == "gestor") {
                            return res.json({
                                status: "erro",
                                msg: "Usuario cadastrado como gestor"
                            });
                        } else {
                            await sequelize
                                .query(usuarioResponsavel, {
                                    type: sequelize.QueryTypes.SELECT
                                })
                                .then(async ([{emailResp}]) => {
                                    if (email == emailResp) {
                                        res.json({
                                            status: "erro",
                                            msg: "Usuario já é o responsável pela máquina"
                                        });
                                    } else {
                                        if (del) {
                                            let sql = `SELECT id_usuario as id FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_maquina = ${maquina} AND responsavel = 's'`;
                                            await sequelize
                                                .query(sql, {
                                                    type: sequelize.QueryTypes
                                                        .SELECT
                                                })
                                                .then(([{id}]) => {
                                                    deleteUsuario(id).catch(
                                                        err => {
                                                            res.json({
                                                                status: "erro1",
                                                                msg: err
                                                            });
                                                        }
                                                    );
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        status: "erro2",
                                                        msg: err
                                                    });
                                                });
                                        } else {
                                            let sql = `UPDATE usuario_maquina SET responsavel = 'n' WHERE fk_maquina = ${maquina} AND responsavel = 's'`;
                                            await sequelize
                                                .query(sql, {
                                                    type: sequelize.QueryTypes
                                                        .UPDATE
                                                })
                                                .catch(err => {
                                                    res.json({
                                                        status: "erro3",
                                                        msg: err
                                                    });
                                                });
                                        }
                                        let selectUsuario = `SELECT id_usuario as id FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_maquina = ${maquina} AND id_usuario = (SELECT id_usuario FROM usuario WHERE email = '${email}')`;
                                        await sequelize
                                            .query(selectUsuario, {
                                                type: sequelize.QueryTypes
                                                    .SELECT
                                            })
                                            .then(async ([response]) => {
                                                if (response) {
                                                    let updateResp = `UPDATE usuario_maquina SET responsavel = 's' WHERE fk_maquina = ${maquina} AND fk_usuario = ${response.id}`;
                                                    await sequelize
                                                        .query(updateResp, {
                                                            type: sequelize
                                                                .QueryTypes
                                                                .UPDATE
                                                        })
                                                        .catch(err => {
                                                            res.json({
                                                                status: "erro4",
                                                                msg: err
                                                            });
                                                        });
                                                } else {
                                                    let insertResp = `INSERT INTO usuario_maquina VALUES (NULL, 's', (SELECT id_usuario FROM usuario WHERE email = '${email}'), ${maquina})`;
                                                    await sequelize
                                                        .query(insertResp, {
                                                            type: sequelize
                                                                .QueryTypes
                                                                .INSERT
                                                        })
                                                        .catch(err => {
                                                            res.json({
                                                                status: "erro5",
                                                                msg: err
                                                            });
                                                        });
                                                }
                                                let selectResp = `SELECT usuario.nome as nome, maquina.nome as maq FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario JOIN maquina ON fk_maquina = pk_maquina AND fk_maquina = ${maquina} WHERE email = '${email}'`;
                                                await sequelize
                                                    .query(selectResp, {
                                                        type: sequelize
                                                            .QueryTypes.SELECT
                                                    })
                                                    .then(([{nome, maq}]) => {
                                                        mandarEmail(
                                                            "convite responsavel",
                                                            nome,
                                                            email,
                                                            [maq]
                                                        )
                                                            .then(() => {
                                                                res.json({
                                                                    status: "ok",
                                                                    msg: "Email de acesso de responsavel por maquina enviado com sucesso"
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
                                    }
                                })
                                .catch(err => {
                                    res.json({status: "erro8", msg: err});
                                });
                        }
                    });
            }
        });
});
router.post("/dados", async (req, res) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let sql = `SELECT id_usuario as id, nome, email, cargo, fk_empresa as id_empresa, fk_supervisor as id_supervisor FROM usuario WHERE id_usuario = ${id}`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .then(([usuario]) => res.json({status: "ok", msg: usuario}))
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/permissao-acesso", async (req, res) => {
    let {id, pk_maquina} = req.body;
    if (!req.body)
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });

    let sql = `INSERT INTO usuario_maquina VALUES (NULL, 'n', ${id}, ${pk_maquina})`;
    let selectUsuario = `SELECT nome, email FROM usuario WHERE id_usuario = ${id}`;
    let selectDados = `SELECT usuario.nome as responsavel, maquina.nome as nomeMaquina FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina = ${pk_maquina}`;
    await sequelize
        .query(sql, {type: sequelize.QueryTypes.INSERT})
        .then(async () => {
            await sequelize
                .query(selectUsuario, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{nome, email}]) => {
                    await sequelize
                        .query(selectDados, {type: sequelize.QueryTypes.SELECT})
                        .then(([{responsavel, nomeMaquina}]) => {
                            mandarEmail("notificacao acesso", nome, email, [
                                nomeMaquina,
                                responsavel
                            ])
                                .then(() =>
                                    res.json({
                                        status: "ok",
                                        msg: "Email de notificação enviado com sucesso"
                                    })
                                )
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

module.exports = router;
