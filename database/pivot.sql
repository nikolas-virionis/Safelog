USE safelog;

CREATE
OR REPLACE VIEW join_dados AS
SELECT
    id_medicao,
    m.valor,
    m.data_medicao,
    tm.tipo,
    id_maquina,
    maquina.nome
FROM
    medicao AS m
    JOIN categoria_medicao cm ON m.fk_categoria_medicao = cm.id_categoria_medicao
    JOIN tipo_medicao AS tm ON cm.fk_tipo_medicao = tm.id_tipo_medicao
    JOIN maquina ON cm.fk_maquina = pk_maquina;

SET
    @sql = NULL;

SET
    @sql = CONCAT(
        'CREATE OR REPLACE VIEW v_analytics AS SELECT id_maquina, nome, data_medicao, ',
        (
            SELECT
                GROUP_CONCAT(
                    DISTINCT CONCAT(
                        'max(case when tipo = ''',
                        tipo,
                        ''' then valor end) ',
                        tipo
                    )
                )
            FROM
                join_dados
        ),
        ' FROM join_dados GROUP BY data_medicao, id_maquina
	ORDER BY nome'
    );

PREPARE stmt
FROM
    @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;