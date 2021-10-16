const { generateToken } = require("../token-user/token");
let sequelize = require("../../models").sequelize;
let send = require("../email/email").mandarEmail;

const checarEmStaff = async (identificacao) => {
    let sqlEmailExistsInStaff;
    if (typeof identificacao == "string")
        sqlEmailExistsInStaff = `SELECT * FROM staff WHERE email = '${identificacao}';`;
    else
        sqlEmailExistsInStaff = `SELECT * FROM staff WHERE id_staff = '${identificacao}';`;
    let existe;
    await sequelize
        .query(sqlEmailExistsInStaff, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((resposta) => (existe = resposta.length > 0));
    return existe;
};

const checarEmUsuario = async (identificacao) => {
    let sqlEmailExistsInUsuario;
    if (typeof identificacao == "string")
        sqlEmailExistsInUsuario = `SELECT * FROM usuario WHERE email = '${identificacao}';`;
    else
        sqlEmailExistsInUsuario = `SELECT * FROM usuario WHERE id_usuario = '${identificacao}';`;
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

const enviarConvite = async (email, cargo, fk_empresa, fk_supervisor) => {
    if (!email)
        return {
            status: "erro",
            msg: "Email não fornecido",
        };
    //checar se email existe em staff ou usuario
    let emStaff;
    let emUsuario;
    await checarEmStaff(email).then((bool) => (emStaff = bool));
    if (emStaff)
        return {
            status: "erro",
            msg: "Usuário ja cadastrado como staff",
        };
    await checarEmUsuario(email).then((bool) => (emUsuario = bool));
    if (emUsuario)
        return {
            status: "erro",
            msg: "Usuário já registrado",
        };
    // geração do id unico
    let hash = generateToken();
    // insert parcial de dados
    await insertParcial(hash, email, cargo, fk_empresa, fk_supervisor).then(
        (res) => send("cadastro", null, email, [hash])
    );
    // email de cadastr enviado para

    return {
        status: "ok",
        msg: "Usuário convidado!",
    };
};

module.exports = { enviarConvite, checarEmStaff, checarEmUsuario };
