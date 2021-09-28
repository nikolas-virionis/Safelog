USE safelog;

SELECT
    *
FROM
    medicao;

SELECT
    DISTINCT id_medicao,
    valor,
    medicao.tipo,
    data_medicao,
    maquina.nome,
    componente.tipo,
    categoria_medicao.medicao_limite,
    id_maquina
FROM
    medicao
    JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
    JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
    AND categoria_medicao.fk_componente = tipo_medicao.fk_componente
    JOIN componente ON tipo_medicao.fk_componente = id_componente
    JOIN maquina ON id_maquina = categoria_medicao.fk_maquina
ORDER BY
    id_maquina,
    id_medicao;

SELECT
    id_medicao,
    valor,
    medicao.tipo,
    data_medicao,
    maquina.nome,
    componente.tipo,
    categoria_medicao.medicao_limite,
    id_maquina
FROM
    medicao,
    categoria_medicao,
    tipo_medicao,
    maquina,
    componente
WHERE
    id_categoria_medicao = fk_categoria_medicao
    AND id_tipo_medicao = fk_tipo_medicao
    AND tipo_medicao.fk_componente = id_componente
    AND id_maquina = categoria_medicao.fk_maquina
ORDER BY
    id_maquina,
    id_medicao;

CREATE TABLE nova (
    id_medicao int PRIMARY KEY,
    valor decimal(5, 2),
    medicao_tipo varchar(10),
    data_medicao datetime,
    maquina_nome varchar(45),
    componente varchar(20),
    unidade varchar(5),
    tipo_medicao varchar(6),
    medicao_limite decimal(6, 2),
    id_maquina char(20)
);

DROP TABLE nova;

INSERT INTO
    nova
SELECT
    DISTINCT id_medicao,
    valor,
    medicao.tipo,
    data_medicao,
    maquina.nome,
    componente.tipo,
    tipo_medicao.unidade,
    tipo_medicao.tipo,
    categoria_medicao.medicao_limite,
    id_maquina
FROM
    medicao
    JOIN categoria_medicao ON id_categoria_medicao = fk_categoria_medicao
    JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao
    AND categoria_medicao.fk_componente = tipo_medicao.fk_componente
    JOIN componente ON tipo_medicao.fk_componente = id_componente
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
            'max(case when Componente = ''',
            Componente,
            ''' then Valor end) ',
            Componente
        )
    ) INTO @sql
FROM
    nova;

SELECT
    @sql;

SET
    @sql = CONCAT(
        'SELECT id_medicao, maquina_nome, data_medicao, ',
        @sql,
        '
                  FROM nova GROUP BY id_medicao, maquina_nome,data_medicao'
    );

PREPARE stmt
FROM
    @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;