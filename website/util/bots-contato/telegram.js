require("dotenv").config();
const axios = require("axios");

const token = process.env.TELEGRAM_TOKEN;
const url = `https://api.telegram.org/bot${token}/`;

// envia msg baseado no chat_id
// retorna "OK" se msg for enviada com sucesso
const sendMessageByChatId = async (chat_id, text) => {
  return await axios.post(`${url}sendMessage`, {
    chat_id,
    text  
  }).then(res => {
    return res.statusText;
  })
  .catch(err => {
    console.log(err);
  })
}

// retorna chat_id de um usuário (que já tenha acessado o bot)
// returna null se usuário não for encontrado
const getChatIdByUsername = async (external_username) => {
  return await axios.post(`${url}getUpdates`)
  .then(async (updates) => {
    const results = updates.data.result;

    for(let result of results) {
      let {username, id} = result.message.from;

      if (username === external_username) {
        return id;
      }
    }

    return null;
  })
}

// envia msg baseado no username 
// retorna "OK" se msg for enviada com sucesso
const sendMessageByUsername = async (username, text) => {
  return getChatIdByUsername(username)
  .then(id => {
    return sendMessageByChatId(id, text)
    .then(res => {
      return res;
    });
  })
}

// testing

// sendMessageByUsername("mesquitola", "calma lá")
// .then(res => {
//   console.log(res);
// });

module.exports = {
  sendMessageByChatId,
  getChatIdByUsername,
  sendMessageByUsername
}