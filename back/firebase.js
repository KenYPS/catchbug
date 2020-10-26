const admin = require('firebase-admin')

var serviceAccount = require('./credential.js')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://catchbug-f8326.firebaseio.com'
})

module.exports = {
  admin
}
