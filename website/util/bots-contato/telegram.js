require("dotenv").config();
const axios = require("axios");
let {sequelize, sequelizeAzure} = require("../../models");

const token = process.env.TELEGRAM_TOKEN;
const url = `https://api.telegram.org/bot${token}/`;

// envia msg baseado no chat_id
// retorna "OK" se msg for enviada com sucesso
const sendMessageByChatId = async (chat_id, text) => {
    return await axios
        .post(`${url}sendMessage`, {
            chat_id,
            text
        })
        .then(res => {
            console.log(`ALERTA - telegram enviado para: ${chat_id}`);
            return res.statusText;
        })
        .catch(err => {
            console.log(err);
        });
};

// retorna chat_id de um usuário (que já tenha acessado o bot)
// returna null se usuário não for encontrado
const getChatIdByUsername = async external_username => {

    return await getChatIdOnTelegramUpdates(external_username) 
    ?? await getChatIdOnDatabase(external_username) 

};

// busca por chat_id no banco de dados
const getChatIdOnDatabase = async (external_username) => {
    return await sequelize.query(`SELECT identificador FROM contato WHERE valor = '${external_username}'`)
    .then(async ([[{identificador}]]) => {
        return identificador
    })
    .catch(err => {
        return null
    })
}

// busca por chat_id no objeto updates do telegram
const getChatIdOnTelegramUpdates = async (external_username) => {
    return await axios.post(`${url}getUpdates`).then(async updates => {
        const results = updates.data.result;

        for (let result of results) {
            let {username, id} = result.message.from;
            
            if (username === external_username) {
                return id;
            }
        }
    });
}

// envia msg baseado no username
// retorna "OK" se msg for enviada com sucesso
const sendMessageByUsername = async (username, text) => {
    return getChatIdByUsername(username).then(async id => {

        if (!id) {
            throw new Error('(TELEGRAM) Nome de usuário não encontrado. O usuário deve entrar em contato com o bot em https://t.me/safelog_alert_bot')
        }

        await updateIdentificador(id, username);
        return sendMessageByChatId(id, text).then(res => {
            return res;
        });
    });
};

// atualiza identificador
const updateIdentificador = async (idTelegram, username) => {

    const sql = `UPDATE contato SET identificador = '${idTelegram}' WHERE valor = '${username}'`;

    await sequelize
        .query(sql, {type: sequelize.QueryTypes.UPDATE})
        .then(async () => {
            await sequelizeAzure.query(sql, {
                type: sequelizeAzure.QueryTypes.UPDATE
            });
        });
};

// testing

// sendMessageByUsername("mesquitola", "message")

module.exports = {
    sendMessageByChatId,
    getChatIdByUsername,
    sendMessageByUsername
};
