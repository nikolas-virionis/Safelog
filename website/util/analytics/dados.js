let {sequelize, sequelizeAzure} = require("../../models");

const getMedicoesTrend = async ({
    idCategoriaMedicao,
    type = "all",
    qtd
} = {}) => {
    if (!idCategoriaMedicao)
        throw "É necessário a identificação da métrica para continuar";

    let sqlMedicoes, sqlMedicoesAzure;

    if (type == "all") {
        sqlMedicoes =
            sqlMedicoesAzure = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC`;
    } else if (type == "day" || type == "week" || type == "month") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} ${type}) AND NOW() ORDER BY data_medicao DESC`;
        sqlMedicoesAzure = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN dateadd(${type}, -${qtd}, getdate()) AND getdate() ORDER BY data_medicao DESC`;
    } else if (type == "qtd") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT ${qtd}`;
        sqlMedicoes = `SELECT TOP ${qtd} valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }

    return await sequelize
        .authenticate()
        .then(async () => {
            return await sequelize
                .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
                .then(medicoes => {
                    if (!medicoes.length)
                        throw "0 medições no período selecionado";
                    medicoes = medicoes.map(el => Number(el.valor));
                    medicoes = [...medicoes].reverse();
                    return medicoes;
                });
        })
        .catch(async err => {
            return await sequelizeAzure
                .query(sqlMedicoesAzure, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
                .then(medicoes => {
                    if (!medicoes.length)
                        throw "0 medições no período selecionado";
                    medicoes = medicoes.map(el => Number(el.valor));
                    medicoes = [...medicoes].reverse();
                    return medicoes;
                });
        });
};

const getStatsChamado = async ({
    idCategoriaMedicao,
    maquina,
    type = "all",
    qtd
} = {}) => {
    let chamados, solucoes, chamadosAzure, solucoesAzure;
    if (!idCategoriaMedicao && !maquina)
        throw "É necessário a identificação da métrica ou maquina para continuar";

    let strDate = ` BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} ${type.toUpperCase()}) AND NOW()`;
    let strId = `${
        idCategoriaMedicao
            ? `= ${idCategoriaMedicao}`
            : ` IN (SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${maquina})`
    }`;
    let strDateAzure = `BETWEEN dateadd(${type}, -${qtd}, getdate()) AND getdate()`;
    let strIdAzure = `${
        idCategoriaMedicao
            ? `= ${idCategoriaMedicao}`
            : ` IN (SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${maquina})`
    }`;

    if (type == "all") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId}`;
        chamadosAzure = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strIdAzure}`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})`;
        solucoesAzure = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})`;
    } else if (type == "day" || type == "week" || type == "month") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId} AND data_abertura ${strDate} ORDER BY data_abertura DESC`;
        chamadosAzure = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_abertura ${strDateAzure} ORDER BY data_abertura DESC`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)`;
        solucoesAzure = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)`;
    } else if (type == "qtd") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_abertura DESC LIMIT ${qtd}`;
        chamadosAzure = `SELECT TOP ${qtd} count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strIdAzure} ORDER BY data_abertura DESC`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})`;
        solucoesAzure = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT TOP ${qtd} id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT TOP ${qtd} id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT TOP ${qtd} id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} ORDER BY data_solucao DESC)`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }

    return await sequelize
        .authenticate()
        .then(async () => {
            return await sequelize
                .query(chamados, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{chamadosTotais, chamadosAbertos}]) => {
                    return await sequelize
                        .query(solucoes, {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(
                            ([
                                {
                                    solucoesTotais,
                                    solucoesEficazes,
                                    solucoesParciais
                                }
                            ]) => {
                                return {
                                    chamadosTotais,
                                    chamadosAbertos,
                                    chamadosFechados: solucoesTotais,
                                    solucoesTotais,
                                    solucoesEficazes,
                                    solucoesParciais
                                };
                            }
                        )
                        .catch(err => ({status: "erro", msg: err}));
                })
                .catch(err => ({status: "erro", msg: err}));
        })
        .catch(async err => {
            return await sequelizeAzure
                .query(chamadosAzure, {type: sequelizeAzure.QueryTypes.SELECT})
                .then(async ([{chamadosTotais, chamadosAbertos}]) => {
                    return await sequelizeAzure
                        .query(solucoesAzure, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                        .then(
                            ([
                                {
                                    solucoesTotais,
                                    solucoesEficazes,
                                    solucoesParciais
                                }
                            ]) => {
                                return {
                                    chamadosTotais,
                                    chamadosAbertos,
                                    chamadosFechados: solucoesTotais,
                                    solucoesTotais,
                                    solucoesEficazes,
                                    solucoesParciais
                                };
                            }
                        )
                        .catch(err => ({status: "erro", msg: err}));
                })
                .catch(err => ({status: "erro", msg: err}));
        });
};

const getStatsMedicao = async ({
    idCategoriaMedicao,
    maquina,
    type = "all",
    qtd
} = {}) => {
    let sqlMedicoes, sqlMedicoesAzure;
    if (!idCategoriaMedicao && !maquina)
        throw "É necessário a identificação da métrica ou maquina para continuar";

    let strDate = ` AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} ${type.toUpperCase()}) AND NOW()`;
    let strId = `${
        idCategoriaMedicao
            ? `= ${idCategoriaMedicao}`
            : ` IN (SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${maquina})`
    }`;
    let strDateAzure = `BETWEEN dateadd(${type}, -${qtd}, getdate()) AND getdate()`;
    let strIdAzure = `${
        idCategoriaMedicao
            ? `= ${idCategoriaMedicao}`
            : ` IN (SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${maquina})`
    }`;

    if (type == "all") {
        sqlMedicoes = `SELECT count(id_medicao) as medicoesTotais, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao ${strId} AND tipo = 'critico') as medicoesCriticas, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao ${strId} AND tipo = 'risco') as medicoesDeRisco FROM medicao WHERE fk_categoria_medicao ${strId}`;
        sqlMedicoesAzure = `SELECT count(id_medicao) as medicoesTotais, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao ${strIdAzure} AND tipo = 'critico') as medicoesCriticas, (SELECT count(id_medicao) FROM medicao WHERE fk_categoria_medicao ${strIdAzure} AND tipo = 'risco') as medicoesDeRisco FROM medicao WHERE fk_categoria_medicao ${strIdAzure}`;
    } else if (type == "day" || type == "week" || type == "month") {
        sqlMedicoes = `SELECT count(id_medicao) as medicoesTotais, (SELECT count(id_medicao) FROM medicao WHERE tipo = 'critico' AND fk_categoria_medicao ${strId} ${strDate}) as medicoesCriticas, (SELECT count(id_medicao) FROM medicao WHERE tipo = 'risco'  AND fk_categoria_medicao ${strId} ${strDate}) as medicoesDeRisco FROM medicao WHERE fk_categoria_medicao ${strId} ${strDate}`;
        sqlMedicoesAzure = `SELECT count(id_medicao) as medicoesTotais, (SELECT count(id_medicao) FROM medicao WHERE tipo = 'critico' AND fk_categoria_medicao ${strIdAzure} ${strDateAzure}) as medicoesCriticas, (SELECT count(id_medicao) FROM medicao WHERE tipo = 'risco'  AND fk_categoria_medicao ${strIdAzure} ${strDateAzure}) as medicoesDeRisco FROM medicao WHERE fk_categoria_medicao ${strIdAzure} ${strDateAzure}`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }
    return await sequelize
        .authenticate()
        .then(async () => {
            return await sequelize
                .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
                .then(
                    ([{medicoesTotais, medicoesCriticas, medicoesDeRisco}]) => {
                        let medicoesNormais =
                            medicoesTotais -
                            (medicoesCriticas + medicoesDeRisco);
                        return {
                            medicoesTotais,
                            medicoesCriticas,
                            medicoesDeRisco,
                            medicoesNormais
                        };
                    }
                )
                .catch(err => ({status: "erro", msg: err}));
        })
        .catch(async err => {
            return await sequelizeAzure
                .query(sqlMedicoesAzure, {
                    type: sequelizeAzure.QueryTypes.SELECT
                })
                .then(
                    ([{medicoesTotais, medicoesCriticas, medicoesDeRisco}]) => {
                        let medicoesNormais =
                            medicoesTotais -
                            (medicoesCriticas + medicoesDeRisco);
                        return {
                            medicoesTotais,
                            medicoesCriticas,
                            medicoesDeRisco,
                            medicoesNormais
                        };
                    }
                )
                .catch(err => ({status: "erro", msg: err}));
        });
};

module.exports = {getMedicoesTrend, getStatsChamado, getStatsMedicao};
