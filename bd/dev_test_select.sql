USE safelog;

SELECT
    *
FROM
    medicao;

SELECT
    id_medicao,
    valor,
    medicao.tipo,
    data_medicao,
    maquina.nome,
    tipo_medicao.unidade,
    tipo_medicao.tipo,
    categoria_medicao.medicao_limite,
    id_maquina
FROM
    medicao
    JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
    JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
    JOIN maquina ON id_maquina = categoria_medicao.fk_maquina
ORDER BY
    id_maquina,
    id_medicao;

CREATE TABLE nova (
    id_medicao int PRIMARY KEY,
    valor decimal(5, 2),
    medicao_tipo varchar(10),
    data_medicao datetime,
    maquina_nome varchar(45),
    unidade varchar(5),
    tipo_medicao varchar(45),
    medicao_limite decimal(6, 2),
    id_maquina char(20)
);

DROP TABLE nova;

INSERT INTO
    nova
SELECT
    id_medicao,
    valor,
    medicao.tipo,
    data_medicao,
    maquina.nome,
    unidade,
    tipo_medicao.tipo,
    categoria_medicao.medicao_limite,
    id_maquina
FROM
    medicao
    JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
    JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
    JOIN maquina ON id_maquina = categoria_medicao.fk_maquina
ORDER BY
    id_maquina,
    id_medicao;

SELECT
    *
FROM
    nova;

SET
    @sql = NULL;

SELECT
    GROUP_CONCAT(
        DISTINCT CONCAT(
            'max(case when tipo = ''',
            tipo,
            ''' then Valor end) ',
            tipo
        )
    ) INTO @sql
FROM
    (
        SELECT
            id_medicao,
            valor,
            medicao.tipo AS medicao_tipo,
            data_medicao,
            maquina.nome,
            unidade,
            tipo_medicao.tipo,
            categoria_medicao.medicao_limite,
            id_maquina
        FROM
            medicao
            JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
            JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
            JOIN maquina ON id_maquina = categoria_medicao.fk_maquina
        ORDER BY
            id_maquina,
            id_medicao
    ) AS tb;

SELECT
    @sql;

SET
    @sql = CONCAT(
        'SELECT id_medicao, maquina.nome, data_medicao, ',
        @sql,
        'FROM (SELECT
    medicao.id_medicao,
    medicao.valor,
    medicao.tipo as medicao_tipo,
    medicao.data_medicao,
    maquina.nome,
    tipo_medicao.unidade,
    tipo_medicao.tipo,
    categoria_medicao.medicao_limite,
    maquina.id_maquina
FROM
    medicao
    JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
    JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
    JOIN maquina ON id_maquina = categoria_medicao.fk_maquina 
ORDER BY
    id_maquina,
    id_medicao) as tb GROUP BY id_medicao, maquina.nome, data_medicao'
    );

PREPARE stmt
FROM
    @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET
    @sql = NULL;

DROP VIEW v;

CREATE VIEW v AS
SELECT
    id_medicao,
    m.valor,
    m.data_medicao,
    tm.tipo,
    cm.fk_maquina
FROM
    medicao AS m
    INNER JOIN categoria_medicao AS cm ON m.fk_categoria_medicao = cm.id_categoria_medicao
    INNER JOIN tipo_medicao AS tm ON cm.fk_tipo_medicao = tm.id_tipo_medicao
WHERE
    cm.fk_maquina = '73-04-cd-e5-6f-a0';

SELECT
    *
FROM
    v;

DROP VIEW v;

-- row to column
SET
    @sql = NULL;

SELECT
    GROUP_CONCAT(
        DISTINCT CONCAT(
            'max(case when v.tipo = ''',
            v.tipo,
            ''' then valor end) ',
            v.tipo
        )
    ) INTO @sql
FROM
    v;

SET
    @sql = CONCAT(
        'SELECT id_medicao, fk_maquina,  ',
        @sql,
        ' FROM v GROUP BY fk_maquina, id_medicao'
    );

PREPARE stmt
FROM
    @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;