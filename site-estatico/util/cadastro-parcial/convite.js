const generateId = require("../id-user/script").generateId;
let sequelize = require("../../models").sequelize;
let send = require("../email/email").mandarEmail;

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

const insertParcial = async (hash, email, cargo, fk_empresa, fk_supervisor) => {
    let insertParcial;

    if (fk_supervisor) {
        insertParcial = `INSERT INTO usuario(email, cargo, token, fk_empresa, fk_supervisor) VALUES ('${email}', '${cargo}', '${hash}', '${fk_empresa}', ${fk_supervisor})`;
    } else {
        insertParcial = `INSERT INTO usuario(email, cargo, token, fk_empresa, fk_supervisor) VALUES ('${email}', '${cargo}', '${hash}', '${fk_empresa}', null)`;
    }
    await sequelize
        .query(insertParcial, {
            type: sequelize.QueryTypes.INSERT,
        })
        .catch((err) => console.error(err));
};

const enviarConvite = async (
    email,
    cargo,
    fk_empresa,
    fk_supervisor,
    complementos
) => {
    if (!email)
        return {
            status: "error",
            msg: "Email não fornecido",
        };
    //checar se email existe em staff ou usuario
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then((bool) => (emStaff = bool));
    if (emStaff)
        return {
            status: "error",
            msg: "Usuário ja cadastrado como staff",
        };
    await checarEmUsuario(email).then((bool) => (emUsuario = bool));
    if (emUsuario)
        return {
            status: "error",
            msg: "Usuário já registrado",
        };
    // geração do id unico
    let hash = generateId();
    // insert parcial de dados
    await insertParcial(hash, email, cargo, fk_empresa, fk_supervisor).then(
        (res) =>
            send("cadastro", null, complementos[0], email, complementos[1], [
                hash,
            ])
    );
    // email de cadastr enviado para

    return {
        status: "ok",
        msg: "Usuário convidado!",
    };
};

module.exports = { enviarConvite };
