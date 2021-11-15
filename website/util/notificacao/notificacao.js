const {msgEmail} = require("../email/msg");

const tiposDefault = [
    "alerta",
    "acesso",
    "convite de acesso",
    "redefinir responsavel",
    "atribuir responsavel",
    "convidar responsavel",
    "notificacao remocao acesso",
    "convite responsavel",
    "notificacao edicao maquina",
    "notificacao acesso",
    "chamado aberto"
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
