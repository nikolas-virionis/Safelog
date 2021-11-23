const {msgEmail} = require("./msg");
const mandarEmail = async (tipo, nome, destinatario, rest) => {
    let nodemailer = require("nodemailer");
    require("dotenv").config();
    let remetente;
    let senha = process.env.PASSWORD;
    let transporter;
    try {
        remetente = process.env.EMAIL;
        transporter = await nodemailer.createTransport({
            service: "gmail", // hostname
            auth: {
                user: remetente,
                pass: senha
            }
        });
        const mailOptions = {
            from: remetente, // sender address
            to: destinatario, // list of receivers
            subject: msgEmail(tipo, nome, rest, destinatario)[1], // Subject line
            html: msgEmail(tipo, nome, rest, destinatario)[0] // plain text body
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw err;
            } else {
                console.log(`ALERTA - email enviado para ${info.accepted[0]}`);
            }
        });
    } catch (e) {
        remetente = process.env.EMAIL_FALLBACK;
        transporter = await nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: "SSLv3"
            },
            auth: {
                user: remetente,
                pass: senha
            }
        });
        const mailOptions = {
            from: remetente, // sender address
            to: destinatario, // list of receivers
            subject: msgEmail(tipo, nome, rest, destinatario)[1], // Subject line
            html: msgEmail(tipo, nome, rest, destinatario)[0] // plain text body
        };
        transporter.sendMail(mailOptions, (err, info) =>
            console.log(
                err || `ALERTA - email enviado para ${info.accepted[0]}`
            )
        );
    }
};

module.exports = {mandarEmail};
