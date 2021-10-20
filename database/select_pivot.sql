USE safelog;

SELECT * FROM medicao;

-- view de auxilio, join tabelas: medicao, categoria_medicao, tipo_medicao
DROP VIEW join_dados;
CREATE OR REPLACE VIEW join_dados AS
SELECT id_medicao, m.valor, m.data_medicao, tm.tipo, cm.fk_maquina, maquina.nome FROM medicao AS m
    JOIN categoria_medicao cm ON m.fk_categoria_medicao = cm.id_categoria_medicao
	JOIN tipo_medicao AS tm ON cm.fk_tipo_medicao = tm.id_tipo_medicao
    JOIN maquina on cm.fk_maquina = id_maquina;

SELECT * FROM join_dados ORDER BY data_medicao DESC LIMIT 10;

-- view analytics pivot
DROP VIEW v_analytics;

SET @sql = NULL;
SET @sql = CONCAT('CREATE OR REPLACE VIEW v_analytics AS SELECT fk_maquina, nome, data_medicao, ', 
	(SELECT GROUP_CONCAT(DISTINCT CONCAT( 
	'max(case when tipo = ''',
	tipo, ''' then valor end) ', tipo)) 
	FROM join_dados), 
	' FROM join_dados GROUP BY data_medicao, fk_maquina
	ORDER BY nome' );

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM v_analytics where nome ='Servidor1' ORDER BY data_medicao DESC LIMIT 10 ; -- sempre ordenar por data

-- insert novo tipo
INSERT INTO tipo_medicao VALUES(null, 'teste_1', 't1'); -- não inserir tipos contendo " "
SELECT * FROM tipo_medicao ORDER BY id_tipo_medicao DESC LIMIT 10;

INSERT INTO categoria_medicao VALUES
(null, 100, '87:f4:a2:f4:26:7f', 8),
(null, 100, '87:f4:a2:f4:26:7f', 7),
(null, 100, '87:f4:a2:f4:26:7f', 6);
SELECT * FROM categoria_medicao ORDER BY id_categoria_medicao DESC LIMIT 10;

INSERT INTO medicao VALUES
(null, 80, 'normal', NOW(), 57),
(null, 90, 'normal', NOW(), 58),
(null, 100, 'normal', NOW(), 59);
SELECT * FROM medicao ORDER BY data_medicao DESC LIMIT 10;
