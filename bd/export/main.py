import mysql.connector as sql
import random
import pandas as pd
import sys

db_connection = sql.connect(host='localhost', database='safelog',
                            user='safelog_dev', password='Safe_Log371$')


def df_to_csv(tb):
    df = pd.read_sql(f"SELECT * FROM v_analytics WHERE fk_maquina = '{tb}'",
                     con=db_connection)
    print(df)
    df.to_csv(f"./bd/export/amostra{tb.replace(':', '')}.csv", index=False)


if len(sys.argv) == 1:
    tb = random.choice(pd.read_sql("SELECT * from maquina",
                                   con=db_connection)["id_maquina"])
    print(tb)
    df_to_csv(tb)
elif sys.argv[1] == "maquina":
    tb = sys.argv[2]
    df_to_csv(tb)

elif sys.argv[1] == "empresa":
    emp = sys.argv[2]
    print(
        f"SELECT id_maquina from maquina WHERE fk_empresa = (SELECT id_empresa FROM empresa where nome = '{emp}')")
    tbs = pd.read_sql(f"SELECT id_maquina from maquina WHERE fk_empresa = (SELECT id_empresa FROM empresa where nome = '{emp}')",
                      con=db_connection)["id_maquina"]
    for tb in tbs:
        df_to_csv(tb)
