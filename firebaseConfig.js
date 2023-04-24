const admin = require("firebase-admin");
const {
  type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url,
} = require("./configEnv");

const apiFirebaseOptions = {
  credential: admin.credential.cert({
    type,
    project_id,
    private_key_id,
    private_key: private_key.replace(/\\n/gm, "\n"),
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
  }),
};

admin.initializeApp(apiFirebaseOptions);

const auth = admin.auth();

module.exports = { auth };
