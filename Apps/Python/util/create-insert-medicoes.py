# script para tentar transformar uma query de select em um txt de um insert similar
import mysql.connector as sql
import pandas as pd
from get_mac_addr import mac_addr
import pathlib
try:
    import pyperclip
except Exception:
    print("Ta no linux aí amigão?!?!?\n")

directory = pathlib.Path(__file__).parent.resolve()

print("\nPara Windows ja esta copiado se tiver a biblioteca pyperclip instalada\nPara Lixux estará em um arquivo txt\n")
db_connection = sql.connect(host='localhost', database='safelog',
                            user='safelog_dev', password='Safe_Log371$')
medicoes = pd.read_sql(
    f"SELECT * FROM medicao WHERE fk_categoria_medicao IN (SELECT id_categoria_medicao FROM categoria_medicao JOIN maquina ON pk_maquina = fk_maquina AND id_maquina = '{mac_addr()}') AND data_medicao BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW() ORDER BY data_medicao", con=db_connection)

valores = medicoes["valor"]
tipos = medicoes["tipo"]
datas = medicoes["data_medicao"]
fks = medicoes["fk_categoria_medicao"]

index = 0
insert_sql = "\nINSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES \n"
for i, j in enumerate(valores):
    if index < 900:
        index += 1
        insert_sql += f" ({j}, '{tipos[i]}', '{datas[i]}', {fks[i]}), \n"
    else:
        index = 0
        insert_sql = insert_sql[:-3] + ";"
        insert_sql += f"\nINSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES \n"
        insert_sql += f" ({j}, '{tipos[i]}', '{datas[i]}', {fks[i]}), \n"

try:
    pyperclip.copy(insert_sql[:-3] + ";")
    print("Copiado para clipboard, soh dar CTRL + V no .sql")
except Exception:
    print("Ta no linux aí amigão?!?!?")
    file = open(f"{directory}/insert.txt", "w")
    file.write(insert_sql[:-3] + ";")
    file.close()
