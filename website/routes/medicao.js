// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;
const {getMachines} = require("../util/get-user-machines/machines");
const {usuariosComAcesso} = require("../util/chamado/acesso");

// formas de contato 
const {sendDirectMessageByEmail} = require("../util/bots-contato/slack") 
const {sendMessageByChatId, sendMessageByUsername} = require("../util/bots-contato/telegram");
const {msgEmail} = require("../util/email/msg");
const {mandarEmail} = require("../util/email/email");

router.post("/relatorio-incidentes/analista", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    let sql = `SELECT pk_maquina FROM maquina JOIN usuario_maquina ON pk_maquina = fk_maquina and fk_usuario = ${id}`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .then(async response => {
            let incidentes = [];
            let incidente = `SELECT id_medicao, data_medicao, valor, unidade, tipo_medicao.tipo as tipo_categoria, maquina.nome, medicao.tipo as estado, fk_categoria_medicao FROM maquina JOIN categoria_medicao ON pk_maquina = fk_maquina JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao JOIN medicao ON fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'risco' OR fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'critico' where ${getMachines(
                response
            )} GROUP BY valor, tipo_medicao.tipo ORDER BY data_medicao DESC;`;
            await sequelize
                .query(incidente, {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(result => {
                    incidentes.push(result);
                })
                .catch(err => res.json({status: "erro", msg: err}));
            return res.json({status: "ok", response: incidentes});
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/alertar-gestor", async (req, res) => {
    let {id, id_medicao} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let dadosUsuario = `SELECT a.nome as analista, g.nome as gestor, g.email FROM usuario as a JOIN usuario as g ON a.fk_supervisor = g.id_usuario and a.id_usuario = ${id}`;
    let dadosMedicao = `SELECT tipo_medicao.tipo, maquina.nome as maquina, data_medicao as data FROM medicao JOIN categoria_medicao ON fk_categoria_medicao = id_categoria_medicao AND id_medicao = ${id_medicao} JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao JOIN maquina ON fk_maquina = pk_maquina;`;
    let updateEstadoMedicao = `UPDATE medicao SET tipo = 'critico' WHERE id_medicao = ${id_medicao}`;

    await sequelize
        .query(dadosUsuario, {type: sequelize.QueryTypes.SELECT})
        .then(async ([{analista, gestor, email}]) => {
            await sequelize
                .query(updateEstadoMedicao, {
                    type: sequelize.QueryTypes.UPDATE
                })
                .then(async () => {
                    await sequelize
                        .query(dadosMedicao, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(([{tipo, maquina, data}]) => {
                            let [componente, metrica] = tipo.split("_");
                            data = new Date(data);
                            data = `${data.toLocaleDateString("pt-BR")} ${data
                                .toTimeString()
                                .slice(0, 8)}`;
                            mandarEmail("alerta", gestor, email, [
                                analista,
                                metrica,
                                componente,
                                maquina,
                                data,
                                "crítica",
                                "manual"
                            ])
                                .then(() => {
                                    res.json({
                                        status: "ok",
                                        msg: "Responsável alertado com sucesso"
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

router.post("/relatorio-incidentes/gestor", async (req, res, next) => {
    let {id} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });
    let sql = `SELECT pk_maquina FROM maquina JOIN usuario_maquina ON fk_maquina = pk_maquina JOIN usuario ON fk_usuario = id_usuario AND fk_supervisor = ${id} GROUP BY pk_maquina;`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .then(async response => {
            let incidentes = [];
            let incidente = `SELECT id_medicao, data_medicao, tipo_medicao.tipo as tipo_categoria, maquina.nome, medicao.tipo as estado, usuario.nome as resp, fk_categoria_medicao FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND responsavel = 's' JOIN maquina ON usuario_maquina.fk_maquina = pk_maquina JOIN categoria_medicao ON pk_maquina = categoria_medicao.fk_maquina JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao JOIN medicao ON fk_categoria_medicao = id_categoria_medicao AND medicao.tipo = 'critico' WHERE ${getMachines(
                response
            )} GROUP BY valor, tipo_medicao.tipo ORDER BY data_medicao DESC;`;
            // res.json(incidente);
            await sequelize
                .query(incidente, {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(result => {
                    incidentes.push(result);
                })
                .catch(err => res.json({status: "erro", msg: err}));
            return res.json({status: "ok", response: incidentes});
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/dados", async (req, res, next) => {
    let {categorias, cargo} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    let medicoes = [];
    for (let {id_categoria_medicao, tipo} of categorias) {
        console.log(id_categoria_medicao, tipo)
        let sql = `SELECT valor, data_medicao, tipo FROM medicao WHERE fk_categoria_medicao = ${id_categoria_medicao} ORDER BY data_medicao DESC LIMIT ${
            cargo == "analista" ? 20 : 60
        }`;
        await sequelize
            .query(sql, {type: sequelize.QueryTypes.SELECT})
            .then(result => {
                medicoes.push({
                    nome: tipo,
                    medicoes: result
                });
            })

            .catch(err => res.json({status: "erro", msg: err}));
    }
    return res.json({status: "ok", msg: medicoes});
});

router.post("/stats", async (req, res) => {
    let {idCategoriaMedicao} = req.body;
    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    const sqlMedicoes = `SELECT count(id_medicao) as medicoesTotais, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND tipo = 'critico') as medicoesCriticas, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND tipo = 'risco') as medicoesDeRisco FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao}`;

    await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .then(([{medicoesTotais, medicoesCriticas, medicoesDeRisco}]) => {
            let medicoesNormais =
                medicoesTotais - (medicoesCriticas + medicoesDeRisco);
            res.json({
                medicoesTotais,
                medicoesCriticas,
                medicoesDeRisco,
                medicoesNormais
            });
        })
        .catch(err => res.json({status: "erro", msg: err}));
});

router.post("/alerta", async(req, res) => {
    const {id_chamado: idChamado} = req.body;

    if (!req.body)
        return res.json({
            status: "alerta",
            msg: "Body não fornecido na requisição"
        });

    const usuarios = await usuariosComAcesso({idChamado});

    for (let user of usuarios) {
        // if(usuario.slack) {
        //     sendDirectMessageByEmail(usuario.slack);
        // }
        // if(usuario.identificador) {
        //     sendMessageByChatId(usuario.identificador);
        // } else if (usuario.telegramUsername) {
        //     sendMessageByUsername(usuario.telegramUsername);
        // }
        console.log(user);
    }

    res.json({usuarios: usuarios.usuarios})
})

module.exports = router;
