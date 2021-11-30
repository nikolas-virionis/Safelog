# script para tentar transformar uma query de select em um txt de um insert similar
import mysql.connector as sql
import pandas as pd
try:
    import pyperclip
except Exception:
    print("Ta no linux aí amigão?!?!?")

print("Eh soh copiar, automatico no Windows, a query gigante com todas as medições e colar no final dos scripts SQL e Azure, substituindo as que estão lá, para registrar permanentemente suas medições")
db_connection = sql.connect(host='localhost', database='safelog',
                            user='safelog_dev', password='Safe_Log371$')
medicoes = pd.read_sql(
    f"SELECT * FROM medicao ORDER BY data_medicao DESC", con=db_connection)

valores = medicoes["valor"]
tipos = medicoes["tipo"]
datas = medicoes["data_medicao"]
fks = medicoes["fk_categoria_medicao"]

insert_sql = "\nINSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES \n"
for i, j in enumerate(valores):
    insert_sql += f" ({j}, '{tipos[i]}', '{datas[i]}', {fks[i]}), \n"

print(insert_sql[:-3] + ";")
try:
    pyperclip.copy(insert_sql[:-3] + ";")
except Exception:
    print("Ta no linux aí amigão?!?!?")
