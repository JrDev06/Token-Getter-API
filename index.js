const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

async function getToken(user, passw) {
  try {
    const EAAAAUUrl = `https://b-api.facebook.com/method/auth.login?email=${user}&password=${passw}&format=json&generate_session_cookies=1&generate_machine_id=1&generate_analytics_claim=1&locale=en_US&client_country_code=US&credentials_type=device_based_login_password&fb_api_caller_class=com.facebook.account.login.protocol.Fb4aAuthHandler&fb_api_req_friendly_name=authenticate&api_key=882a8490361da98702bf97a021ddc14d&access_token=350685531728%7C62f8ce9f74b12f84c123cc23437a4a32`;
    const EAAAAUResponse = await axios.get(EAAAAUUrl);
    const EAAAAUData = EAAAAUResponse.data;
    const EAAAAUResult = EAAAAUData.access_token ? EAAAAUData.access_token : `ERROR: ${EAAAAUData.error_msg}`;

    const EAADYPUrl = `https://b-api.facebook.com/method/auth.login?access_token=237759909591655%25257C0f140aabedfb65ac27a739ed1a2263b1&format=json&sdk_version=1&email=${user}&locale=en_US&password=${passw}&sdk=ios&generate_session_cookies=1&sig=3f555f98fb61fcd7aa0c44f58f522efm`;
    const EAADYPResponse = await axios.get(EAADYPUrl);
    const EAADYPData = EAADYPResponse.data;
    const EAADYPResult = EAADYPData.access_token ? EAADYPData.access_token : `ERROR: ${EAADYPData.error_msg}`;

    return { EAAAAU: EAAAAUResult, EAADYP: EAADYPResult };
  } catch (error) {
    throw new Error(`ERROR: While getting your access token: ${error.message}`);
  }
}

app.get('/get-token', async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const tokens = await getToken(email, password);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
