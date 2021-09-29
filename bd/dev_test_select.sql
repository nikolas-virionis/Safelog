USE safelog;

SELECT * FROM medicao;

DROP VIEW dados;
CREATE VIEW dados AS
SELECT id_medicao, m.valor, m.data_medicao, tm.tipo, cm.fk_maquina, maquina.nome FROM medicao AS m
    JOIN categoria_medicao cm ON m.fk_categoria_medicao = cm.id_categoria_medicao
	JOIN tipo_medicao AS tm ON cm.fk_tipo_medicao = tm.id_tipo_medicao
    JOIN maquina on cm.fk_maquina = id_maquina;
SELECT * FROM dados;

SET @sql = NULL;
SELECT GROUP_CONCAT(DISTINCT CONCAT( 
			'max(case when tipo = ''',
            tipo, ''' then valor end) ', tipo)) 
            INTO @sql FROM dados;
SET @sql = CONCAT( 'SELECT fk_maquina, nome, data_medicao, ', @sql, 
		' FROM dados GROUP BY data_medicao, fk_maquina
        ORDER BY nome' );

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;