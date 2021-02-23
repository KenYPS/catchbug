module.exports = {
  type: 'service_account',
  project_id: 'catchbug-f8326',
  // private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email:
    'firebase-adminsdk-7ho3s@catchbug-f8326.iam.gserviceaccount.com',
  client_id: '108204616709044710386',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7ho3s%40catchbug-f8326.iam.gserviceaccount.com',
}