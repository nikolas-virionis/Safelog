import mysql.connector as sql
import pandas as pd
import sys
import pathlib
import os

db_connection = sql.connect(host='localhost',
                            database='safelog', user='safelog_dev', password='Safe_Log371$')

directory = pathlib.Path(__file__).parent.resolve()


def df_to_csv(tb, emp, name):
    df = pd.read_sql(
        f"SELECT * FROM v_analytics WHERE id_maquina = '{tb}'", con=db_connection)
    emp = emp.strip().replace(" ", "_")
    print(os.path.exists(f"{directory}/csv/{emp}"), emp == 'NYSE_MARKET,_INC')
    if not os.path.exists(f"{directory}/csv/{emp}"):
        os.mkdir(f"{directory}/csv/{emp}")
    print(df)
    df.to_csv(
        f"{directory}/csv/{emp}/amostra{name.capitalize()}.csv", index=False)


if len(sys.argv) == 1:
    select = pd.read_sql("SELECT id_maquina, nome, fk_empresa FROM maquina ORDER BY RAND() LIMIT 1",
                         con=db_connection)
    tb, name, fk_empresa = select["id_maquina"][0], select["nome"][0], select["fk_empresa"][0]
    print(tb, name, fk_empresa)
    emp = pd.read_sql(
        f"SELECT nome from empresa WHERE id_empresa = '{fk_empresa}'", con=db_connection)["nome"][0]
    print("random: ", tb, emp, name)
    df_to_csv(tb, emp, name)
# dict(zip(new_keys,old_dict.values()))
elif sys.argv[1] == "maquina":
    tb = sys.argv[2].lower()
    select = pd.read_sql(
        f"SELECT empresa.nome from maquina JOIN empresa ON fk_empresa = id_empresa AND id_maquina = '{tb}'", con=db_connection)
    emp = select["nome"][0].strip()
    print("\n\n", emp, emp == "NYSE MARKET, INC", "\n\n")
    select = pd.read_sql(
        f"SELECT nome from maquina WHERE id_maquina = '{tb}'", con=db_connection)
    name = select["nome"][0]
    df_to_csv(tb, emp, name)

elif sys.argv[1] == "empresa":
    emp = sys.argv[2]
    print("\n\n", emp, emp == "NYSE MARKET, INC", "\n\n")
    print(
        f"SELECT id_maquina, nome from maquina WHERE fk_empresa = (SELECT id_empresa FROM empresa where nome like '{emp}')")
    select = pd.read_sql(f"SELECT id_maquina, nome from maquina WHERE fk_empresa = (SELECT id_empresa FROM empresa where nome like '{emp}')",
                         con=db_connection)
    id_maquina = select["id_maquina"]
    nome = select["nome"]
    print("\n\n", id_maquina, nome, "\n\n")
    for i, j in enumerate(id_maquina):
        tb = id_maquina[i]
        name = nome[i]
        df_to_csv(tb, emp, name)

db_connection.close()
