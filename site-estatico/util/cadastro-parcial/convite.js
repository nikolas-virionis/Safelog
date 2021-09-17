
const generateId = require("../util/id-user/script").generateId;

const checarEmStaff = email => {
    let sqlEmailExistsInStaff = `SELECT * FROM staff WHERE email = '${email}';`;
    let existe;
    sequelize
        .query(sqlEmailExistsInStaff, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) =>
            existe = resposta.length > 0
        );
    return existe;
}

const checarEmUsuario = email => {
    let sqlEmailExistsInUsuario = `SELECT * FROM usuario WHERE email = '${email}';`;
    let existe;
    sequelize
        .query(sqlEmailExistsInUsuario, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) =>
            existe = resposta.length > 0
        );
    return existe;
}

const gerarId = () => {
    let hash, hashesFound;
    do {
        hash = generateId();
        let sqlHashExists = `SELECT * FROM usuario WHERE id_usuario = '${hash}' `;
        //
        sequelize
            .query(sqlHashExists, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then((response) => (hashesFound = response.length));
    } while (hashesFound > 0);
    return hash;
}

const insertParcial = (hash, email, cargo, fk_empresa, fk_supervisor) => {
    let insertParcial = `INSERT INTO usuario(id_usuario, email, cargo, fk_empresa, fk_supervisor) VALUES ('${hash}', '${email}', '${cargo}', '${fk_empresa}', '${fk_supervisor}')`;
    sequelize
        .query(insertParcial, {
            type: sequelize.QueryTypes.INSERT,
        })
        .catch((err) => console.error(err))
}

module.exorts = {checarEmStaff, checarEmUsuario, gerarId, insertParcial}