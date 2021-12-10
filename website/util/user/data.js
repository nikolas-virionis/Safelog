let {sequelize, sequelizeAzure} = require("../../models");
const dadosUsuario = async id => {
    let sql = `SELECT id_usuario as id, nome, email, cargo, fk_empresa as id_empresa, fk_supervisor as id_supervisor FROM usuario WHERE id_usuario = ${id}`;

    return await sequelize
        .query(sql, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(sql, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(([usuario]) => ({status: "ok", msg: usuario}))
        .catch(err => ({status: "erro", msg: err}));
};

module.exports = {dadosUsuario};
