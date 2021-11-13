let sequelize = require("../../models").sequelize;

const getMedicoesTrend = async ({
    idCategoriaMedicao,
    type = "week",
    qtd = 1
} = {}) => {
    if (!idCategoriaMedicao)
        throw "É necessário a identificação da métrica para continuar";

    let sqlMedicoes;

    if (type == "day") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} DAY) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "week") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} WEEK) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "month") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} MONTH) AND NOW() ORDER BY data_medicao DESC`;
    } else if (type == "qtd") {
        sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT ${qtd}`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }
    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 100`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 200`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 50`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW() ORDER BY data_medicao DESC`;

    // let sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 2 WEEK) AND NOW() ORDER BY data_medicao DESC`;
    return await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .then(medicoes => {
            if (!medicoes.length) throw "0 medições no período selecionado";
            medicoes = medicoes.map(el => Number(el.valor));
            medicoes = [...medicoes].reverse();
            return medicoes;
        });
};

const getStatsChamado = async ({
    idCategoriaMedicao,
    maquina,
    type = "all",
    qtd
} = {}) => {
    console.log(idCategoriaMedicao, maquina, type, qtd);
    let chamados, solucoes;
    if (!idCategoriaMedicao && !maquina)
        throw "É necessário a identificação da métrica ou maquina para continuar";

    let strDate = ` BETWEEN DATE_SUB(NOW(),INTERVAL ${qtd} ${type.toUpperCase()}) AND NOW()`;
    let strId = `${
        idCategoriaMedicao
            ? `= ${idCategoriaMedicao}`
            : ` IN (SELECT id_categoria_medicao FROM categoria_medicao WHERE fk_maquina = ${maquina})`
    }`;

    if (type == "all") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId}`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId})`;
    } else if (type == "day" || type == "week" || type == "month") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId} AND data_abertura ${strDate} ORDER BY data_abertura DESC`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesEficazes, (SELECT count(id_solucao) FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} AND data_solucao ${strDate} ORDER BY data_solucao DESC)`;
        // } else if (type == "week") {
        // } else if (type == "month") {
    } else if (type == "qtd") {
        chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_abertura DESC LIMIT ${qtd}`;

        solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})) as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial' AND fk_chamado IN (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})) as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao ${strId} ORDER BY data_solucao DESC LIMIT ${qtd})`;
    } else {
        throw "erro na definição do tipo de metrica de data";
    }

    // let chamados = `SELECT count(id_chamado) as chamadosTotais, (SELECT count(id_chamado) FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao} AND status_chamado = 'aberto') as chamadosAbertos FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao}`;
    // let solucoes = `SELECT count(id_solucao) as solucoesTotais, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'total') as solucoesEficazes, (SELECT count(id_solucao) as solucoesTotais FROM solucao WHERE eficacia = 'parcial') as solucoesParciais FROM solucao WHERE fk_chamado in (SELECT id_chamado FROM chamado WHERE fk_categoria_medicao = ${idCategoriaMedicao})`;

    return await sequelize
        .query(chamados, {type: sequelize.QueryTypes.SELECT})
        .then(async ([{chamadosTotais, chamadosAbertos}]) => {
            return await sequelize
                .query(solucoes, {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(
                    ([
                        {solucoesTotais, solucoesEficazes, solucoesParciais}
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
};

module.exports = {getMedicoesTrend, getStatsChamado};
