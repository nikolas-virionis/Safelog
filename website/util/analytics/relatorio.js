let {sequelize, sequelizeAzure} = require("../../models");
const {getStatsMedicao, getStatsChamado} = require("./dados");
const {getTrendBehavior} = require("./trendLine");

const relatorio = async (maquinas, cargo) => {
    let {queryDate, data} = getDates(cargo);
    maquinas = await Promise.all(
        maquinas.map(async el => {
            let sqlFks = `SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${el.pk_maquina}`;
            return await sequelize
                .query(sqlFks, {type: sequelize.QueryTypes.SELECT})
                .catch(async err =>
                    Promise.resolve(
                        await sequelizeAzure.query(sqlFks, {
                            type: sequelizeAzure.QueryTypes.SELECT
                        })
                    )
                )
                .then(fks => ({
                    ...el,
                    fksCategoria: fks.map(el => el.id_categoria_medicao)
                }))
                .catch(err => console.error(err));
        })
    );
    console.log(maquinas);
    return (
        (await statsChamado(maquinas, queryDate, data)) +
        (await statsMedicao(maquinas, queryDate, data)) +
        (await statsTrend(maquinas, queryDate, data))
    );
};

const statsChamado = async (maquinas, queryDate, data) => {
    let relatorioChamado = `\nChamados ${data}: \n`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        console.log(fksCategoria);
        relatorioChamado += formatChamado(
            `Maquina: ${nomeMaquina}\n\tGeral`,
            await getStatsChamado({
                maquina: pk_maquina,
                type: queryDate,
                qtd: 1
            })
        );

        for (let fk of fksCategoria) {
            let sql = `SELECT tipo_medicao.tipo FROM tipo_medicao JOIN categoria_medicao ON fk_tipo_medicao = id_tipo_medicao AND id_categoria_medicao = ${fk}`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{tipo}]) => {
                    relatorioChamado += formatChamado(
                        getTipo(tipo),
                        await getStatsChamado({
                            idCategoriaMedicao: fk,
                            type: queryDate,
                            qtd: 1
                        })
                    );
                })
                .catch(err => {
                    console.error("\n\n", err);
                });
        }
    }
    return relatorioChamado;
};

const statsMedicao = async (maquinas, queryDate, data) => {
    let relatorioMedicao = `\nMedições ${data}: \n`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        relatorioMedicao += formatMedicao(
            `Maquina: ${nomeMaquina}\n\tGeral`,
            await getStatsMedicao({
                maquina: pk_maquina,
                type: queryDate,
                qtd: 1
            })
        );

        for (let fk of fksCategoria) {
            let sql = `SELECT tipo_medicao.tipo FROM tipo_medicao JOIN categoria_medicao ON fk_tipo_medicao = id_tipo_medicao AND id_categoria_medicao = ${fk}`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{tipo}]) => {
                    relatorioMedicao += formatMedicao(
                        getTipo(tipo),
                        await getStatsMedicao({
                            idCategoriaMedicao: fk,
                            type: queryDate,
                            qtd: 1
                        })
                    );
                })
                .catch(err => {
                    console.error("\n\n", err);
                });
        }
    }
    return relatorioMedicao;
};

const statsTrend = async (maquinas, queryDate, data) => {
    let relatorioTrend = `\nTendências ${data}: \n`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        relatorioTrend += `Maquina: ${nomeMaquina}\n`;

        for (let fk of fksCategoria) {
            let sql = `SELECT tipo_medicao.tipo FROM tipo_medicao JOIN categoria_medicao ON fk_tipo_medicao = id_tipo_medicao AND id_categoria_medicao = ${fk}`;
            await sequelize
                .query(sql, {type: sequelize.QueryTypes.SELECT})
                .then(async ([{tipo}]) => {
                    relatorioTrend += formatTrend(
                        getTipo(tipo),
                        await getTrendBehavior({
                            idCategoriaMedicao: fk,
                            type: queryDate,
                            qtd: 1
                        })
                    );
                })
                .catch(err => {
                    console.error("\n\n", err);
                });
        }
    }
    return relatorioTrend;
};

const getDates = cargo => {
    if (cargo == "analista") {
        return {
            queryDate: "day",
            data: "no ultimo dia"
        };
    }
    return {
        queryDate: "week",
        data: "na ultima semana"
    };
};

const formatChamado = (
    tipo,
    {
        chamadosTotais,
        chamadosAbertos,
        chamadosFechados,
        solucoesTotais,
        solucoesEficazes,
        solucoesParciais
    }
) => {
    return (
        `\n\t${tipo}: \n` +
        `\t\tChamados Totais: ${chamadosTotais}` +
        `\t\tSoluções Totais: ${solucoesTotais}\n` +
        `\t\tChamados Abertos: ${chamadosAbertos}` +
        `\t\tSoluções Eficazes: ${solucoesEficazes}\n` +
        `\t\tChamados Fechados: ${chamadosFechados}` +
        `\t\tSoluções Parciais: ${solucoesParciais}\n`
    );
};

const formatMedicao = (
    tipo,
    {medicoesTotais, medicoesCriticas, medicoesDeRisco, medicoesNormais}
) => {
    return (
        `\n\t${tipo}: \n` +
        `\t\tMedições Totais: ${medicoesTotais}` +
        `\t\tMedições Críticas: ${medicoesCriticas}\n` +
        `\t\tMedições De Risco: ${medicoesDeRisco}` +
        `\t\tMedições Normais: ${medicoesNormais}\n`
    );
};

const formatTrend = (tipo, {orientacao, comportamento}) =>
    `\n\t${tipo}: ${orientacao} ${comportamento}\n`;

const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};

module.exports = {relatorio};
