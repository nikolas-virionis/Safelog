let {sequelize, sequelizeAzure} = require("../../models");
const {LinearModel} = require("linear-regression-model");

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
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao ${strId} AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId}`;
        chamadosAzure = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strIdAzure}`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})`;
        solucoesAzure = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure})`;
    } else if (type == "day" || type == "week" || type == "month") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao ${strId} AND status_chamado = 'aberto' AND data_abertura ${strDate}) as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId} AND data_abertura ${strDate}`;
        chamadosAzure = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND status_chamado = 'aberto' AND data_abertura ${strDateAzure}) as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_abertura ${strDateAzure}`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)`;
        solucoesAzure = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strIdAzure} AND data_solucao ${strDateAzure} ORDER BY data_solucao DESC)`;
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

const corrData = async metricas => {
    let metricasCorr = [];
    for (let index in metricas) {
        for (let i = index; i < metricas.length; i++) {
            if (
                ((metricas[index].tipo.slice(0, 3) == "cpu" ||
                    metricas[i].tipo.slice(0, 3) == "cpu") &&
                    metricas[index] &&
                    metricas[i] &&
                    metricas[index].tipo.slice(-5) !=
                        metricas[i].tipo.slice(-5)) ||
                (metricas[index].tipo.slice(0, 3) !=
                    metricas[i].tipo.slice(0, 3) &&
                    metricas[index].tipo.slice(-5) !=
                        metricas[i].tipo.slice(-5) &&
                    metricas[index] &&
                    metricas[i])
            ) {
                metricasCorr.push({
                    x: metricas[index],
                    y: metricas[i]
                });
            }
        }
    }
    metricasCorr = await Promise.all(
        metricasCorr.map(async el => {
            let corr = new LinearModel(
                await getMedicoesTrend({
                    idCategoriaMedicao: el.x.id_categoria_medicao
                }),
                await getMedicoesTrend({
                    idCategoriaMedicao: el.y.id_categoria_medicao
                })
            );
            corr = corr.getCorrelation();
            return {...el, corr};
        })
    );
    return metricasCorr;
};

const getRelevantCorr = async corrData => {
    let corrs = [{corr: 0}];
    if (corrData.length > 2) {
        corrs.push(corrs[0]);
        corrs.push(corrs[0]);
    }

    outerFor: for (let correlation of corrData) {
        for (let corrIndex in corrs) {
            if (Math.abs(correlation.corr) > Math.abs(corrs[corrIndex].corr)) {
                for (let index = corrs.length - 1; index > corrIndex; index--) {
                    corrs[index] = {...corrs[index - 1]};
                }
                corrs[corrIndex] = {...correlation};
                continue outerFor;
            }
        }
    }
    return corrs;
};
module.exports = {
    getMedicoesTrend,
    getStatsChamado,
    getStatsMedicao,
    corrData,
    getRelevantCorr
};
