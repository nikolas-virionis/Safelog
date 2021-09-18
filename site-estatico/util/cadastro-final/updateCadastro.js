let sequelize = require("../../models").sequelize;

const updateDadosUsuario = async (id, nome, email, senha) => {
    let sql = `UPDATE usuario SET nome = '${nome}', email = '${email}', senha = MD5('${senha}') WHERE id_usuario = ${id};`;
    await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
    return { status: "ok" };
};

const criarFormasContato = async (id, contatos) => {
    let forma = 1;
    Object.entries(contatos).forEach(async ([key, value]) => {
        if (key == "whatsapp") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 1);`;
            await sequelize.query(sql, { type: sequelize.QueryTypes.INSERT });
        } else if (key == "telegram") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 2);`;
            await sequelize.query(sql, { type: sequelize.QueryTypes.INSERT });
        } else if (key == "slack") {
            let sql = `INSERT INTO contato VALUES (${id}, ${forma++}, '${value}', 3);`;
            await sequelize.query(sql, { type: sequelize.QueryTypes.INSERT });
        }
    });
    return { status: "ok" };
};

module.exports = { updateDadosUsuario, criarFormasContato };
