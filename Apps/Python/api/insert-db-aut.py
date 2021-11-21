import pandas as pd
import psutil
import time
from connectdb import insert_db
from getmac import get_mac_address as mac_addr
import mysql.connector as sql
from credentials import usr, pswd
import pyodbc

db_connection = ""
try:
    db_connection = sql.connect(host='172.31.25.218', database='safelog',
                            user=usr, password=pswd)
except: 
    server = 'tcp:srvsafelog.database.windows.net'
    database = 'safelog'
    username = usr
    password = pswd
    db_connection = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
                              server+';DATABASE='+database+';UID='+username+';PWD=' + password)
                              
preferences = pd.read_sql(
    f"SELECT tipo_medicao.tipo FROM categoria_medicao INNER JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao WHERE fk_maquina = (SELECT pk_maquina FROM maquina WHERE id_maquina = '{mac_addr()}')", con=db_connection)
db_connection.close()
try:
    while True:
        data_medicao = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        medicao = 0
        dados = [data_medicao]
        for tipo in preferences["tipo"]:
            if tipo == "cpu_frequencia":
                medicao = round(psutil.cpu_freq().current *
                                100 / psutil.cpu_freq().max, 2)
            elif tipo == "cpu_porcentagem":
                medicao = round(psutil.cpu_percent(), 2)
            elif tipo == "ram_porcentagem":
                medicao = round(psutil.virtual_memory().percent, 2)
            elif tipo == "ram_livre":
                medicao = round(psutil.virtual_memory().free / 1073741824, 2)
            elif tipo == "disco_livre":
                medicao = round(psutil.disk_usage('/').free / 1073741824, 2)
            elif tipo == "disco_porcentagem":
                medicao = round(psutil.disk_usage('/').percent, 2)
            else:
                continue
            dados.append({"tipo": tipo, "medicao": medicao})
        insert_db(dados)
        time.sleep(1)
except KeyboardInterrupt:
    pass
