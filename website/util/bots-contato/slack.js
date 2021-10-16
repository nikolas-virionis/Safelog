function enviarSlack(channelId, text) {
  const { WebClient } = require("@slack/web-api");

  // An access token (from your Slack app or custom integration - xoxp, xoxb)
  const token = process.env.SLACK_TOKEN;

  const web = new WebClient(token);

  // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
  const conversationId = channelId;
  // enviarMsg(web, conversationId, text)
}

const enviarMsg = async (web, channel, text) => {
  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({
    channel,
    text,
  });

  // `res` contains information about the posted message
  console.log(res, "\nMessage sent: ", res.ts);
};
// enviarSlack();
module.exports = { enviarSlack };
