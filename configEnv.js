const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  type: process.env.NODE_APP_TYPE,
  project_id: process.env.NODE_APP_PROJECT_ID,
  private_key_id: process.env.NODE_APP_PRIVATE_KEY_ID,
  private_key: process.env.NODE_APP_PRIVATE_KEY,
  client_email: process.env.NODE_APP_CLIENT_EMAIL,
  client_id: process.env.NODE_APP_CLIENT_ID,
  auth_uri: process.env.NODE_APP_AUTH_URI,
  token_uri: process.env.NODE_APP_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NODE_APP_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.NODE_APP_CLIENT_URL,
};
