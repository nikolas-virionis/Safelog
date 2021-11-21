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
    try:
        mydb = mysql.connector.connect(
            host="172.31.25.218",
            user=usr,
            password=pswd,
            database="safelog"
        )
    except mysql.connector.Error as e:
        server = 'tcp:srvsafelog.database.windows.net'
        database = 'safelog'
        username = usr
        password = pswd
        mydb = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
                              server+';DATABASE='+database+';UID='+username+';PWD=' + password)
        print("Erro ao conectar com o MySQL", e)

    finally:
        if mydb.is_connected():
            data, *medicoes = value
            mycursor = mydb.cursor()
            db_Info = mydb.get_server_info()
            print("Conectado ao MySQL Server versão ", db_Info)
            for medicao in medicoes:
                sql = f"""SELECT id_categoria_medicao, medicao_limite FROM categoria_medicao JOIN tipo_medicao ON id_tipo_medicao = fk_tipo_medicao AND tipo_medicao.tipo = '{medicao["tipo"]}' AND fk_maquina = (SELECT pk_maquina FROM maquina WHERE id_maquina = '{mac_addr()}')"""

                sql = pd.read_sql(sql, con=mydb)
                fk, limite = sql["id_categoria_medicao"][0], sql["medicao_limite"][0]

                sql_query = f"""INSERT INTO medicao VALUES (NULL, {medicao["medicao"]}, '{get_tipo(medicao["tipo"], medicao["medicao"], limite)}', '{data}', {fk})"""

                mycursor.execute(sql_query)

            mydb.commit()

            print(mycursor.rowcount, "registro inserido")

        if(mydb.is_connected()):
            mycursor.close()
            mydb.close()
            print("Conexão com MySQL está fechada\n")
