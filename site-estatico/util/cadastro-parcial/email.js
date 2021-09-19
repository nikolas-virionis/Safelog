const mandarEmail = async (
    tipo,
    nome,
    remetente,
    destinatario,
    senha,
    rest
) => {
    let nodemailer = require("nodemailer");
    let transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: remetente,
            pass: senha,
        },
    });
    const mailOptions = {
        from: remetente, // sender address
        to: destinatario, // list of receivers
        subject: msgEmail(tipo, nome, rest, destinatario)[1], // Subject line
        html: msgEmail(tipo, nome, rest, destinatario)[0], // plain text body
    };
    transporter.sendMail(mailOptions, (err, info) => console.log(err || info));
};

const msgEmail = (tipo, nome, rest, email) => {
    if (tipo.toLowerCase() == "cadastro")
        return [
            `
    <p>Prezado(a),</p>
    <p><a href="http://localhost:3000/cadastro-pessoa.html?token=${rest[0]}&email=${email}" target="_blank">
    Clique aqui</a> para se cadastrar concluir seu cadastro</p>
    <p>Seu token de verificação é <i>${rest[0]}</i></p>
    `,
            "Cadastro SafeLog",
        ];
    if (tipo.toLowerCase() == "relatorio")
        return [
            `
    <p>Prezado(a) ${nome},</p>
    <p>Relatorio enviado com sucesso</p>
    `,
            "Relatório Periódico - SafeLog",
        ];
    if (tipo.toLowerCase() == "alerta")
        return [
            `
    <p>Prezado(a) ${nome},</p>
    <p>Alerta enviado com sucesso</p>
    `,
            "Alerta - SafeLog",
        ];
    throw new Error(
        "tipo de email não especificado ou escrito de forma errada"
    );
};
// mandarEmail("tipo", "nome", "remetente", "destinatario", "senha");
module.exports = { mandarEmail };
