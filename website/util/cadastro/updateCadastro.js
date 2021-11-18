let {sequelize, sequelizeAzure} = require("../../models");

const updateDadosUsuario = async (id, nome, email, senha) => {
    let sql = `UPDATE usuario SET nome = '${nome}', email = '${email}', senha = MD5('${senha}') WHERE id_usuario = ${id};`;
    await sequelize
        .query(sql, {type: sequelize.QueryTypes.UPDATE})
        .catch(() => Promise.resolve())
        .then(async () => {
            let sqlAzure = `UPDATE usuario SET nome = '${nome}', email = '${email}', senha = HASHBYTES('MD5', '${senha}' WHERE id_usuario = ${id})`;
            await sequelizeAzure(sqlAzure, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
        });
    return {status: "ok"};
};

const criarFormasContato = async (id, contatos) => {
    let forma = 1;
    Object.entries(contatos).forEach(async ([key, value]) => {
        if (key == "whatsapp") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 1);`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.INSERT})
                .catch(err => {
                    console.log(err)
                    return Promise.resolve();
                })
                .then(async () => {
                    await sequelizeAzure.query(sql, {
                        type: sequelizeAzure.QueryTypes.INSERT
                    });
                });
        } else if (key == "telegram") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 2);`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.INSERT})
                .catch(() => Promise.resolve())
                .then(async () => {
                    await sequelizeAzure.query(sql, {
                        type: sequelizeAzure.QueryTypes.INSERT
                    });
                });
        } else if (key == "slack") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 3);`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.INSERT})
                .catch(() => Promise.resolve())
                .then(async () => {
                    await sequelizeAzure.query(sql, {
                        type: sequelizeAzure.QueryTypes.INSERT
                    });
                });
        }
    });
    return {status: "ok"};
};

module.exports = {updateDadosUsuario, criarFormasContato};
