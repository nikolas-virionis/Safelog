const generateId = require("../id-user/script").generateId;
let sequelize = require("../../models").sequelize;
let send = require("./email").mandarEmail;

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

    let insertParcial;

    if(fk_supervisor) {
        insertParcial = `INSERT INTO usuario(id_usuario, email, cargo, fk_empresa, fk_supervisor) VALUES ('${hash}', '${email}', '${cargo}', '${fk_empresa}', '${fk_supervisor}')`;
    } else {
        insertParcial = `INSERT INTO usuario(id_usuario, email, cargo, fk_empresa, fk_supervisor) VALUES ('${hash}', '${email}', '${cargo}', '${fk_empresa}', null)`;
    }
    await sequelize
        .query(insertParcial, {
            type: sequelize.QueryTypes.INSERT,
        })
        .catch((err) => console.error(err));
};

const enviarConvite = async (email, cargo, fk_empresa, fk_supervisor, complementos) => {
    
    if (!email) return {
        status: "error",
        msg: "Email não fornecido"
    }
    //checar se email existe em staff ou usuario
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then((bool) => (emStaff = bool));
    if (emStaff)
        return {
            status: "error",
            msg: "Usuário ja cadastrado como staff"
        };
    await checarEmUsuario(email).then((bool) => (emUsuario = bool));
    if (emUsuario) return {
        status: "error",
        msg: "Usuário já registrado"
    };
    // geração do id unico
    let hash;
    await gerarId().then((id) => (hash = id));
    // insert parcial de dados
    await insertParcial(hash, email, cargo, fk_empresa, fk_supervisor);
    // email de cadastr enviado para
    await send("cadastro", null, complementos[0], email, complementos[1], [
        hash,
    ]);

    return {
        status: "ok",
        msg: "Usuário convidado!"
    };
}

module.exports = { checarEmStaff, checarEmUsuario, gerarId, insertParcial, enviarConvite };
