# script para tentar transformar uma query de select em um txt de um insert similar
import mysql.connector as sql
import pandas as pd
import pyperclip

db_connection = sql.connect(host='localhost', database='safelog',
                            user='root', password='DigitalSchool1$')
medicoes = pd.read_sql(f"SELECT * FROM medicao WHERE fk_categoria_medicao > 56",
                       con=db_connection)
categorias = pd.read_sql(
    f"SELECT * FROM categoria_medicao WHERE id_categoria_medicao > 56",
    con=db_connection)
print(categorias)
limites = categorias["medicao_limite"]
maquinas = categorias["fk_maquina"]
tipos_med = categorias["fk_tipo_medicao"]
valores = medicoes["valor"]
tipos = medicoes["tipo"]
datas = medicoes["data_medicao"]
fks = medicoes["fk_categoria_medicao"]

insert_sql = ""

insert_sql += "INSERT INTO maquina VALUES ('0c:9d:92:c6:cc:19', 'DESKTOP1', MD5('ExSenha1'), '203783731'); \n"
insert_sql += "INSERT INTO usuario_maquina(responsavel, fk_usuario, fk_maquina) VALUES ('s', 13, '0c:9d:92:c6:cc:19'); \n"
for i, j in enumerate(limites):
    insert_sql += f"INSERT INTO categoria_medicao(medicao_limite, fk_maquina, fk_tipo_medicao) VALUES ({limites[i]}, '{maquinas[i]}', {tipos_med[i]}); \n"
insert_sql += "INSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES \n"
for i, j in enumerate(valores):
    insert_sql += f" ({valores[i]}, '{tipos[i]}', '{datas[i]}', {fks[i]}), \n"
print(insert_sql[:-3] + ";")
pyperclip.copy(insert_sql[:-3] + ";")
