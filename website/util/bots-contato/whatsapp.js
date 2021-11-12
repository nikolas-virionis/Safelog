// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

function mandarWhatsapp(to, body) {
  client.messages
    .create({
      from: `whatsapp:+14155238886`,
      to: `whatsapp:+55${to}`,
      body
    })
    .then((message) => console.log(`ALERTA - whatsapp enviado para: +55${to} `));
}

// mandarWhatsapp();
module.exports = { mandarWhatsapp };