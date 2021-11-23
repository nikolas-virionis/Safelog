let {sequelize, sequelizeAzure} = require("../../models");

const maquinasDependentesAnalista = async (id, search, main, order) => {
    let responsavel = `SELECT pk_maquina, id_maquina, maquina.nome AS maquina, usuario.nome AS responsavel FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND responsavel = 's' JOIN maquina ON fk_maquina = pk_maquina AND pk_maquina IN (SELECT pk_maquina FROM maquina JOIN usuario_maquina ON fk_maquina = pk_maquina AND fk_usuario = ${id}) ${
        search
            ? ` WHERE id_maquina LIKE '%${search}%' OR maquina.nome LIKE '%${search}%' OR usuario.nome LIKE '%${search}%'`
            : ``
    } ${
        main
            ? ` ORDER BY ${
                  main == "id"
                      ? "id_maquina"
                      : main == "nome"
                      ? "maquina.nome"
                      : "usuario.nome"
              } ${order}`
            : ""
    };`;
    return await sequelize
        .query(responsavel, {type: sequelize.QueryTypes.SELECT})
        .catch(async err => {
            return Promise.resolve(
                await sequelizeAzure.query(responsavel, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            );
        })
        .then(response => ({status: "ok", msg: response}))
        .catch(err => ({status: "erro", msg: err}));
};

const maquinasDependentesGestor = async id => {
    let dependentes = `SELECT pk_maquina, id_maquina, maquina.nome AS maquina, usuario.nome AS usuario FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario AND fk_supervisor = ${id} JOIN maquina ON pk_maquina = fk_maquina ${
        search
            ? ` WHERE id_maquina LIKE '%${search}%' OR maquina.nome LIKE '%${search}%' OR usuario.nome LIKE '%${search}%'`
            : ``
    } GROUP BY pk_maquina ${
        main
            ? ` ORDER BY ${
                  main == "id"
                      ? "id_maquina"
                      : main == "nome"
                      ? "maquina.nome"
                      : "usuario.nome"
              } ${order}`
            : " ORDER BY pk_maquina, responsavel"
    }`;
    return await sequelize
        .query(dependentes, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(dependentes, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async maquinas => {
            if (maquinas.length) {
                return {status: "ok", msg: maquinas};
            } else {
                return {
                    status: "alerta",
                    msg: "Usuario não possui maquinas dependentes"
                };
            }
        })
        .catch(err => ({status: "erro", msg: err}));
};

const maquinasDependentesAdmin = async id => {
    let dependentes = `SELECT pk_maquina, id_maquina, maquina.nome AS maquina, a.nome AS usuario FROM usuario AS g JOIN usuario AS a ON a.fk_supervisor = g.id_usuario AND g.fk_supervisor = ${id} JOIN usuario_maquina ON fk_usuario = a.id_usuario JOIN maquina ON pk_maquina = fk_maquina ${
        search
            ? ` WHERE id_maquina LIKE '%${search}%' OR maquina.nome LIKE '%${search}%' OR usuario.nome LIKE '%${search}%'`
            : ``
    } GROUP BY pk_maquina ${
        main
            ? ` ORDER BY ${
                  main == "id"
                      ? "id_maquina"
                      : main == "nome"
                      ? "maquina.nome"
                      : "usuario.nome"
              } ${order}`
            : " ORDER BY pk_maquina, responsavel"
    }`;
    return await sequelize
        .query(dependentes, {type: sequelize.QueryTypes.SELECT})
        .catch(async err =>
            Promise.resolve(
                await sequelizeAzure.query(dependentes, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
            )
        )
        .then(async maquinas => {
            if (maquinas.length) {
                return {status: "ok", msg: maquinas};
            } else {
                return {
                    status: "alerta",
                    msg: "Usuario não possui maquinas dependentes"
                };
            }
        })
        .catch(err => ({status: "erro", msg: err}));
};

const maquinasDependentes = async (cargo, id, search, main, order) => {
    return eval(
        `maquinasDependentes${cargo.charAt(0).toUpperCase() + cargo.slice(1)}`
    )(id, search, main, order);
};

module.exports = {maquinasDependentes};
