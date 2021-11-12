require("dotenv").config();
const axios = require("axios");
const qs = require("querystring");

const token = process.env.SLACK_TOKEN_BOT;

// request config
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

// get userid by email
const getUserIdByEmail = async(email) => {
  const body = {
    token,
    email
  }

  // request
  const res = await axios.post("https://slack.com/api/users.lookupByEmail", qs.stringify(body), config)

  return res.data.user.id;
}

// send msg to private channel
const sendDirectMessageById = async (userId, msg) => {
  const body = {
    token,
    channel: userId,
    text: msg
  }

  // request
  const res = await axios.post("https://slack.com/api/chat.postMessage", qs.stringify(body), config)

  if (res.data.ok) {
    return {
      status: "ok",
      msg: `ALERTA - slack enviado para: ${userId}`
    }
  } else {
    return {
      status: "erro",
      msg: res.data.error
    }
  }
}

const sendDirectMessageByEmail = async(email, msg) => {
  return getUserIdByEmail(email)
  .then(id => {
    return sendDirectMessageById(id, msg)
    .then(async res => {
      return res;
    })
  })
}

module.exports = { 
  sendDirectMessageByEmail,
  sendDirectMessageById,
  getUserIdByEmail
}