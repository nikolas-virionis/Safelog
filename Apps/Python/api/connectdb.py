import mysql.connector
from credentials import usr, pswd
from getmac import get_mac_address as mac_addr
import pandas as pd
import pyodbc


def get_tipo(tipo, medicao, limite):
    # x * 0.6 + 38 => %
    # 0.65x + 28.5 => °C
    # 0.409x + 0.08 => ram livre
    # 0.26x + 21 => disco livre
    # 0.8x + 33.5 => cpu Mhz (%)
    if tipo.endswith("temperatura") and medicao >= (limite * 0.65) + 28.5 or tipo.endswith("porcentagem") and medicao >= (limite * 0.6) + 38 or tipo.endswith("frequencia") and medicao >= (limite * 0.8) + 33.5 or tipo == "disco_livre" and medicao <= (limite * 0.26) + 21 or tipo == "ram_livre" and medicao <= (limite * 0.409) + 0.08:
        return "critico"
    if tipo.endswith("livre") and medicao <= limite or not tipo.endswith("livre") and medicao >= limite:
        return "risco"
    return "normal"


def insert_db(value):
    mydb = ""
    my_aws = ""
    my_azure = ""
    try:
        mydb = mysql.connector.connect(
            host="172.31.25.218",
            user=usr,
            password=pswd,
            database="safelog"
        )
        my_aws = mydb
        server = 'tcp:srvsafelog.database.windows.net'
        database = 'safelog'
        username = usr
        password = pswd
        my_azure = pyodbc.connect('DRIVER={SQL Server};SERVER=' +
                                  server+';DATABASE='+database+';UID='+username+';PWD=' + password)
    except Exception:
        server = 'tcp:srvsafelog.database.windows.net'
        database = 'safelog'
        username = usr
        password = pswd
        mydb = pyodbc.connect('DRIVER={SQL Server};SERVER=' +
                              server+';DATABASE='+database+';UID='+username+';PWD=' + password)
        my_azure = mydb

    finally:
        data, *medicoes = value
        mycursor_aws = my_aws.cursor() if my_aws else False
        mycursor_azure = my_azure.cursor() if my_azure else False
        for medicao in medicoes:
            sql = f"""SELECT id_categoria_medicao, medicao_limite FROM categoria_medicao JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao AND tipo_medicao.tipo = '{medicao["tipo"]}' AND fk_maquina = (SELECT pk_maquina FROM maquina WHERE id_maquina = '{mac_addr()}')"""

            sql = pd.read_sql(sql, con=mydb)
            fk, limite = sql["id_categoria_medicao"][0], sql["medicao_limite"][0]

            sql_query = f"""INSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES ({medicao["medicao"]}, '{get_tipo(medicao["tipo"], medicao["medicao"], limite)}', '{data}', {fk})"""

            if (my_azure):
                mycursor_azure.execute(sql_query)
            if (my_aws):
                mycursor_aws.execute(sql_query)

            mydb.commit()

            print(mycursor_aws.rowcount if my_aws else mycursor_azure.rowcount,
                  "registro inserido")

        if (my_aws):
            mycursor_aws.close()
            my_aws.close()

        if (my_azure):
            mycursor_azure.close()
            my_azure.close()

        try:
            mydb.close()
        except Exception:
            print("")
        print("Conexão com MySQL está fechada\n")
