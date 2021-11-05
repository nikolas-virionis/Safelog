require("dotenv").config();
const axios = require("axios");
const qs = require("querystring");

const token = process.env.SLACK_TOKEN 

const getUserIdByEmail = email => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  
  const body = {
    token,
    email
  }
  
  axios.post("https://slack.com/api/users.lookupByEmail", qs.stringify(body), config)
  .then(res => {
    console.log(res.data.user.id)
  });
}

// getUserIdByEmail("lucas.msouza@bandtec.com.br")

module.exports = {getUserIdByEmail}