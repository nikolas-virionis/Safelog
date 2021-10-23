let sequelize = require("../../models").sequelize;
const maquinasDependentes = async id => {
    let dependentes = `SELECT pk_maquina, id_maquina, nome as maquina FROM maquina JOIN usuario_maquina ON fk_maquina = pk_maquina and fk_usuario = ${id}`;
    return await sequelize
        .query(dependentes, {type: sequelize.QueryTypes.SELECT})
        .then(async response => {
            let maquinas = [];
            for (let {pk_maquina, id_maquina, maquina} of response) {
                let responsavel = `SELECT usuario.nome FROM usuario JOIN usuario_maquina ON fk_usuario = id_usuario and responsavel = 's' and fk_maquina = ${pk_maquina};`;
                await sequelize
                    .query(responsavel, {
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(([{nome: usuario}]) =>
                        maquinas.push({
                            pk_maquina,
                            id_maquina,
                            maquina,
                            responsavel: usuario
                        })
                    )
                    .catch(err => ({status: "erro", msg: err}));
            }
            return maquinas;
        })
        .catch(err => ({status: "erro", msg: err}));
};
module.exports = {maquinasDependentes};
