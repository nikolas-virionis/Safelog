let {sequelize, sequelizeAzure} = require("../../models");
const {getStatsMedicao, getStatsChamado} = require("./data");
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
    let relatorioChamado = `<br>Chamados ${data}: <br>`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        console.log(fksCategoria);
        relatorioChamado += formatChamado(
            `Maquina: ${nomeMaquina}<br>&nbsp;&nbsp;&nbsp;&nbsp;Geral`,
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
                    console.error("<br><br>", err);
                });
        }
    }
    return relatorioChamado;
};

const statsMedicao = async (maquinas, queryDate, data) => {
    let relatorioMedicao = `<br>Medições ${data}: <br>`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        relatorioMedicao += formatMedicao(
            `Maquina: ${nomeMaquina}<br>&nbsp;&nbsp;&nbsp;&nbsp;Geral`,
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
                    console.error("<br><br>", err);
                });
        }
    }
    return relatorioMedicao;
};

const statsTrend = async (maquinas, queryDate, data) => {
    let relatorioTrend = `<br>Tendências ${data}: <br>`;
    for (let {pk_maquina, nomeMaquina, fksCategoria} of maquinas) {
        relatorioTrend += `Maquina: ${nomeMaquina}<br>`;

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
                    console.error("<br><br>", err);
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
        `<br>&nbsp;&nbsp;&nbsp;&nbsp;${tipo}: <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chamados Totais: ${chamadosTotais}` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Soluções Totais: ${solucoesTotais}<br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chamados Abertos: ${chamadosAbertos}` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Soluções Eficazes: ${solucoesEficazes}<br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chamados Fechados: ${chamadosFechados}` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Soluções Parciais: ${solucoesParciais}<br>`
    );
};

const formatMedicao = (
    tipo,
    {medicoesTotais, medicoesCriticas, medicoesDeRisco, medicoesNormais}
) => {
    return (
        `<br>&nbsp;&nbsp;&nbsp;&nbsp;${tipo}: <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medições Totais: ${medicoesTotais}` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medições Críticas: ${medicoesCriticas}<br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medições De Risco: ${medicoesDeRisco}` +
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medições Normais: ${medicoesNormais}<br>`
    );
};

const formatTrend = (tipo, {orientacao, comportamento}) =>
    `<br>&nbsp;&nbsp;&nbsp;&nbsp;${tipo}: ${orientacao} ${comportamento}<br>`;

const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};

module.exports = {relatorio};
