import mysql.connector as sql
import pandas as pd
import pathlib
try:
    import pyperclip
except Exception:
    print("Ta no linux aí amigão?!?!?\n")

directory = pathlib.Path(__file__).parent.resolve()

print("\nPara Windows ja esta copiado se tiver a biblioteca pyperclip instalada\nPara Lixux estará em um arquivo txt\n")
db_connection = sql.connect(host='localhost', database='safelog',
                            user='safelog_dev', password='Safe_Log371$')
chamados = pd.read_sql(
    "SELECT titulo, descricao, data_abertura, status_chamado, prioridade, automatico, fk_categoria_medicao, fk_usuario FROM chamado", con=db_connection)
solucoes = pd.read_sql(
    "SELECT titulo, descricao, data_solucao, eficacia, fk_chamado, fk_usuario FROM solucao", con=db_connection)

str = "\nINSERT INTO chamado(titulo, descricao, data_abertura, status_chamado, prioridade, automatico, fk_categoria_medicao, fk_usuario) VALUES \n"

for index, item in enumerate(chamados["titulo"]):
    str += f'''('{item}', '{chamados["descricao"][index]}', '{chamados["data_abertura"][index]}', '{chamados["status_chamado"][index]}', '{chamados["prioridade"][index]}', '{chamados["automatico"][index]}', {chamados["fk_categoria_medicao"][index]}, {chamados["fk_usuario"][index]}), \n'''
str = str[:-3] + ";\n\n"

str += "INSERT INTO solucao(titulo, descricao, data_solucao, eficacia, fk_chamado, fk_usuario) VALUES \n"
for index, item in enumerate(solucoes["titulo"]):
    str += f'''('{item}', '{solucoes["descricao"][index]}', '{solucoes["data_solucao"][index]}', '{solucoes["eficacia"][index]}', {solucoes["fk_chamado"][index]}, {solucoes["fk_usuario"][index]}), \n'''
str = str[:-3] + ";\n"

try:
    pyperclip.copy(str[:-3] + ";")
    print("Copiado para clipboard, soh dar CTRL + V no .sql")
except Exception:
    print("Ta no linux aí amigão?!?!?")
    file = open(f"{directory}/insert-chamado.txt", "w")
    file.write(str)
    file.close()
