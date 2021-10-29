let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/criar", async (req, res) => {
    let {titulo, desc, prioridade, idCategoriaMedicao, idUsuario} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro", 
            msg: "Body não fornecido na requisição"
        });
    } else {

        // verificando se usuario tem acesso à máquina    
        const sqlUsuarioTemAcesso = `SELECT * FROM usuario_maquina WHERE fk_usuario = ${idUsuario} AND fk_maquina = 
        (SELECT fk_maquina FROM categoria_medicao WHERE id_categoria_medicao = ${idCategoriaMedicao})`;

        await sequelize.query(sqlUsuarioTemAcesso, {type: sequelize.QueryTypes.SELECT})
        .then(async (response) => {

            // usuario tem acesso
            if (response.length > 0) {
                let sqlCriaChamado = `INSERT INTO chamado(titulo, descricao, data_abertura, status_chamado, prioridade, fk_categoria_medicao, fk_usuario) VALUES 
                ('${titulo}', '${desc}', NOW(), 'aberto', '${prioridade}', ${idCategoriaMedicao}, ${idUsuario})`;

                sequelize.query(sqlCriaChamado, {type: sequelize.QueryTypes.INSERT})
                .then(response => {
                    return res.json({
                        status: "ok",
                        msg: "chamado aberto",
                        res: response
                    });
                })
                .catch(err => {
                    return res.json({
                        status: "erro", 
                        msg: err
                    })
                })
            } else {
                // usuario não tem acesso 
                res.json({
                    status: "alerta",
                    msg: "usuário não tem acesso à máquina"
                })
            }
        }) 
        .catch(err => {
            return res.json({
                status: "erro", 
                msg: err
            })
        })
    }
})

module.exports = router;