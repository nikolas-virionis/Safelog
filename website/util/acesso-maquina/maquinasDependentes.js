let sequelize = require("../../models").sequelize;

const maquinasDependentes = async (id, search, main, order) => {
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
        .then(response => response)
        .catch(err => ({status: "erro", msg: err}));
};
module.exports = {maquinasDependentes};
