const generateId = require("../id-user/script").generateId;
let sequelize = require("../../models").sequelize;

const checarEmStaff = async (email) => {
    let sqlEmailExistsInStaff = `SELECT * FROM staff WHERE email = '${email}';`;
    let existe;
    await sequelize
        .query(sqlEmailExistsInStaff, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) => (existe = resposta.length > 0));
    return existe;
};

const checarEmUsuario = async (email) => {
    let sqlEmailExistsInUsuario = `SELECT * FROM usuario WHERE email = '${email}';`;
    let existe;
    await sequelize
        .query(sqlEmailExistsInUsuario, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) => (existe = resposta.length > 0));
    return existe;
};

const gerarId = async () => {
    let hash, hashesFound;
    do {
        hash = await generateId();
        console.log(hash);
        let sqlHashExists = `SELECT * FROM usuario WHERE id_usuario = '${hash}' `;
        //
        await sequelize
            .query(sqlHashExists, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then((response) => (hashesFound = response.length));
    } while (hashesFound > 0);
    return hash;
};

const insertParcial = async (hash, email, cargo, fk_empresa, fk_supervisor) => {
    let insertParcial = `INSERT INTO usuario(id_usuario, email, cargo, fk_empresa, fk_supervisor) VALUES ('${hash}', '${email}', '${cargo}', '${fk_empresa}', '${fk_supervisor}')`;
    await sequelize
        .query(insertParcial, {
            type: sequelize.QueryTypes.INSERT,
        })
        .catch((err) => console.error(err));
};

module.exports = { checarEmStaff, checarEmUsuario, gerarId, insertParcial };
