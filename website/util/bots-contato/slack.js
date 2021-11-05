require("dotenv").config();
const axios = require("axios");
const qs = require("querystring");

const token = process.env.SLACK_TOKEN 

const getUserIdByEmail = async(email) => {
  // request config
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  
  const body = {
    token,
    email
  }

  const res = await axios.post("https://slack.com/api/users.lookupByEmail", qs.stringify(body), config)

  return res;
}

module.exports = {getUserIdByEmail}