function mandarEmail(tipo, nome, remetente, destinatario, senha) {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: remetente,
      pass: senha,
    },
  });
  const mailOptions = {
    from: remetente, // sender address
    to: destinatario, // list of receivers
    subject: "Email enviado nodemailer", // Subject line
    html: msgEmail(tipo, nome), // plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => console.log(err || info));
}

function msgEmail(tipo, nome) {
  if (tipo.toLowerCase() == "cadastro")
    return `
    <p>Prezado(a) ${nome},</p>
    <p>Email de cadastro enviado com sucesso</p>
    `;
  if (tipo.toLowerCase() == "relatorio")
    return `
    <p>Prezado(a) ${nome},</p>
    <p>Relatorio enviado com sucesso</p>
    `;
  if (tipo.toLowerCase() == "alerta")
    return `
    <p>Prezado(a) ${nome},</p>
    <p>Alerta enviado com sucesso</p>
    `;
  throw new Error("tipo de email não especificado ou escrito de forma errada");
}
// mandarEmail("tipo", "nome", "remetente", "destinatario", "senha");
module.exports = { mandarEmail };
