import mysql.connector as sql

usr = 'root'
pswd = 'DigitalSchool1$'

db_connection = sql.connect(host='localhost', database='safelog',
                            user=usr, password=pswd)
