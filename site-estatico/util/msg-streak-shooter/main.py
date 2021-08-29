import sys  # importando sistema, deixa com que seja possivel passar parametros na chamada do modulo node
# importando 2 bibliotecas que realizam o email e enviam
import smtplib
import email.message

# escolha do tipo do email
def msgEmail(tipo):
    if (tipo.lower() == "cadastro"):
        return f"""
    <p>Prezado(a) {sys.argv[2]},</p>
    <p>Email de cadastro enviado com sucesso</p>
    """
    if (tipo.lower() == "relatorio"):
        return f"""
    <p>Prezado(a) {sys.argv[2]},</p>
    <p>Relatorio enviado com sucesso</p>
    """
    if (tipo.lower() == "alerta"):
        return f"""
    <p>Prezado(a) {sys.argv[2]},</p>
    <p>Alerta enviado com sucesso</p>
    """
    print("tipo de email não especificado ou escrito de forma errada")
    raise ValueError(
        "tipo de email não especificado ou escrito de forma errada")

def main():
    # retorno da função escolhendo corpo do email
    corpo_email = msgEmail(sys.argv[1])
    # corpo_email = msgEmail("cadastro")
    msg = email.message.Message()
    msg['Subject'] = "Email enviado python"
    msg['From'] = sys.argv[3]
    msg['To'] = sys.argv[4]
    password = sys.argv[5]
    # msg['From'] = "safelog.contato@gmail.com"
    # msg['To'] = "lmesquita466@gmail.com";
    # password = "Safe_Log371$"
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)
    s = smtplib.SMTP('smtp.gmail.com: 587')
    s.starttls()
    s.login(msg['From'], password)
    s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
    print('Email enviado')

if __name__ == "__main__":
    main()
