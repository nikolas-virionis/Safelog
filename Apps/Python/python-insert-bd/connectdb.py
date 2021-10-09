import mysql.connector
from credentials import usr, pswd


def insert_db(cpu, ram, disco):
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user=usr,
            password=pswd,
            database="safelog_analytics"
        )

        if mydb.is_connected():
            db_Info = mydb.get_server_info()
            print("Conectado ao MySQL Server versão ", db_Info)

            mycursor = mydb.cursor()

            sql_query = f"INSERT INTO analytics(cpu, ram, disco, data_medicao) VALUES ({cpu}, {ram}, {disco}, now())"
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