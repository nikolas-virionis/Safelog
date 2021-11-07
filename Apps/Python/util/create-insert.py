# script para tentar transformar uma query de select em um txt de um insert similar
import mysql.connector as sql
import pandas as pd
import pyperclip

db_connection = sql.connect(host='localhost', database='safelog',
                            user='root', password='DigitalSchool1$')
medicoes = pd.read_sql(f"SELECT * FROM medicao WHERE fk_categoria_medicao > 42",
                       con=db_connection)
categorias = pd.read_sql(
    f"SELECT * FROM categoria_medicao WHERE id_categoria_medicao > 42",
    con=db_connection)
# print(categorias)


def get_tipo(tipo, medicao, limite):
    # x * 0.6 + 38 => %
    # 0.65x + 28.5 => °C
    # 0.409x + 0.08 => ram livre
    # 0.26x + 21 => disco livre
    # 0.8x + 33.5 => cpu Mhz (%)
    # print(type("tipo"))
    if (type(tipo) != "<class 'str'>"):
        if (tipo == 1):
            tipo = "cpu_temperatura"
        elif (tipo == 2):
            tipo = "cpu_frequencia"
        elif (tipo == 3):
            tipo = "cpu_porcentagem"
        elif (tipo == 4):
            tipo = "ram_porcentagem"
        elif (tipo == 5):
            tipo = "ram_livre"
        elif (tipo == 6):
            tipo = "disco_porcentagem"
        else:
            tipo = "disco_livre"

    if tipo.endswith("temperatura") and medicao >= (limite * 0.65) + 28.5 or tipo.endswith("porcentagem") and medicao >= (limite * 0.6) + 38 or tipo.endswith("frequencia") and medicao >= (limite * 0.8) + 33.5 or tipo == "disco_livre" and medicao <= (limite * 0.26) + 21 or tipo == "ram_livre" and medicao <= (limite * 0.409) + 0.08:
        return "critico"
    if tipo.endswith("livre") and medicao <= limite or not tipo.endswith("livre") and medicao >= limite:
        return "risco"
    return "normal"


limites = categorias["medicao_limite"]
maquinas = categorias["fk_maquina"]
tipos_med = categorias["fk_tipo_medicao"]
valores = medicoes["valor"]
datas = medicoes["data_medicao"]
fks = medicoes["fk_categoria_medicao"]
tipos = [get_tipo(fks[i] - 42, valores[i], limites[(fks[i] - 43)])
         for i in range(len(fks))]

insert_sql = ""

insert_sql += "INSERT INTO maquina VALUES ('0c:9d:92:c6:cc:19', 'DESKTOP1', MD5('ExSenha1'), '203783731'); \n"

insert_sql += "INSERT INTO usuario_maquina(responsavel, fk_usuario, fk_maquina) VALUES ('s', 13, '0c:9d:92:c6:cc:19'); \n"
for i, j in enumerate(limites):
    insert_sql += f"INSERT INTO categoria_medicao(medicao_limite, fk_maquina, fk_tipo_medicao) VALUES ({limites[i]}, '{maquinas[i]}', {tipos_med[i]}); \n"

insert_sql += "INSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES \n"
for i, j in enumerate(valores):
    insert_sql += f" ({j}, '{tipos[i]}', '{datas[i]}', {fks[i]}), \n"

print(insert_sql[:-3] + ";")
pyperclip.copy(insert_sql[:-3] + ";")
