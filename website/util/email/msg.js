const msgEmail = (tipo, nome, rest, email) => {
    if (tipo.toLowerCase() == "cadastro")
        return [
            `
    <p>Prezado(a),</p>
    <p><a href="http://localhost:3000/cadastro-pessoa?token=${rest[0]}&email=${email}" target="_blank">
    Clique aqui</a> para se cadastrar concluir seu cadastro</p>
    <p>Seu token de verificação é <i>${rest[0]}</i></p>
    `,
            "Cadastro SafeLog"
        ];
    if (tipo.toLowerCase() == "relatorio")
        return [
            `
    <p>Prezado(a) ${nome},</p>
    <p>Relatorio enviado com sucesso</p>
    `,
            "Relatório Periódico - SafeLog"
        ];
    if (tipo.toLowerCase() == "alerta")
        return [
            `
    <p>Prezado(a) ${nome},</p>
    <p>Alerta enviado com sucesso</p>
    `,
            "Alerta - SafeLog"
        ];
    if (tipo.toLowerCase() == "redefinir")
        return [
            `
        <p>Prezado(a) ${nome},</p>
        <p><a href="http://localhost:3000/redefinir-senha?token=${rest[0]}&email=${email}" target="_blank">
        Clique aqui</a> para se redefinir sua senha</p>
        <p>Seu token de verificação é <i>${rest[0]}</i></p>
        `,
            "Redefinição de senha - SafeLog"
        ];
    if (tipo.toLowerCase() == "acesso")
        return [
            `
                <p>Prezado(a) ${nome},</p>
                <p><a href="http://localhost:3000/permitir-acesso?token=${rest[0]}&email=${email}&id=${rest[3]}&maquina=${rest[4]}" target="_blank">
                Clique aqui</a> para permitir o acesso de ${rest[1]} à máquina ${rest[2]}</p>
                <p>Seu token de verificação é <i>${rest[0]}</i></p> 
                `,
            "Permissão de acesso a maquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "convite de acesso")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>Você recebeu um convite de acesso para a máquina ${rest[0]} de ${rest[1]}</p> 
            <p>Para utilizar e visualizar seus recursos, acesse sua dashboard em nosso site</p>
                        `,
            "Convite de acesso a maquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "redefinir responsavel")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>${rest[0]} está sendo removido(a) do sistema da safelog, porém esse é o responsável pela máquina ${rest[1]}, e para melhor funcionamento, é necessário um usuário responsável por cada máquina, então</p> 
            <p><a href="http://localhost:3000/redefinir-responsavel">Clique aqui</a> para redefinir o responsável pela maquina
                `,
            "Redefinição de responsável por máquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "atribuir responsavel")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>${rest[0]} está sendo removido(a) do sistema da safelog, porém esse é o responsável pela máquina ${rest[1]}, se ninguem for assinalado para tal função a máquina será removida de nosso sistema, então</p> 
            <p><a href="http://localhost:3000/redefinir-responsavel">Clique aqui</a> para redefinir o responsável pela maquina ou </p>
            <p><a href="http://localhost:3000/deletar-maquina">Clique aqui</a> para concretizar a remoção da máquina</p> 
                        `,
            "Reatribuição de responsável por máquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "notificacao remocao acesso")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>Você teve seu acesso à maquina ${rest[0]} removido por seu responsável ${rest[1]}</p> 
            <p>Para utilizar e visualizar seus recursos, acesse sua dashboard em nosso site</p>
                                    `,
            "Remoção de acesso a maquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "convite responsavel")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>Você recebeu acesso de responsável à maquina ${rest[0]}</p> 
            <p>Para utilizar e visualizar seus recursos, acesse sua dashboard em nosso site</p>
                                        `,
            "Acesso de responsável por máquina - SafeLog"
        ];
    if (tipo.toLowerCase() == "notificacao edicao maquina")
        return [
            `
            <p>Prezado(a) ${nome},</p>
            <p>Uma das máquinas que você possui acesso, teve uma alteração, feita por ${[
                rest[0]
            ]}</p> 
            <p>Para utilizar e visualizar seus recursos, acesse sua dashboard em nosso site</p>
                                            `,
            "Máquina alterada por responsável - SafeLog"
        ];
    throw new Error(
        "tipo de email não especificado ou escrito de forma errada"
    );
};
module.exports = {msgEmail};
