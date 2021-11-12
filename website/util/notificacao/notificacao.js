const {msgEmail} = require("../email/msg");

const tiposDefault = [
    "alerta", // feito 
    "acesso", // feito
    "convite de acesso", // feito
    "redefinir responsavel", // feito
    "atribuir responsavel", // feito
    "convidar responsavel", // feito
    "notificacao remocao acesso",
    "convite responsavel", // feito (aprovado)
    "notificacao edicao maquina", // feito
    "notificacao acesso"
];
const msg = (tipo, nome, rest, email) => {
    // criacao da notificacao
    if (tiposDefault.includes(tipo.toLowerCase()))
        return msgEmail(tipo, nome, rest, email);
    if (tipo.toLowerCase() == "boas vindas")
        return [
            `<p>Prezado(a) ${nome},</p>
        <p>Nós da SafeLog agradecemos fortemente sua presença aqui, e vamos construir um futuro muito produtivo juntos, isso é apenas o começo</p>`,
            `Bem vindo(a)`
        ];
};

module.exports = {msg};
