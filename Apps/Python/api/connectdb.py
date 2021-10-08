import mysql.connector
from credentials import usr, pswd


def insert_db(value):
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user=usr,
            password=pswd,
            database="safelog"
        )

        if mydb.is_connected():
            db_Info = mydb.get_server_info()
            print("Conectado ao MySQL Server versão ", db_Info)

            mycursor = mydb.cursor()

            sql_query = f"INSERT INTO analytics(cpu, ram, disco, data_medicao) VALUES ({value[0]}, {value[1]}, {value[2]}, now())"
            mycursor.execute(sql_query)
            mydb.commit()

            print(mycursor.rowcount, "registro inserido")
    except mysql.connector.Error as e:
        print("Erro ao conectar com o MySQL", e)
    finally:
        if(mydb.is_connected()):
            mycursor.close()
            mydb.close()
            print("Conexão com MySQL está fechada\n")
