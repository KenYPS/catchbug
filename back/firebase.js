const admin = require("firebase-admin")

var serviceAccount = require("./catchbug-f8326-firebase-adminsdk-7ho3s-05767e750b.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://catchbug-f8326.firebaseio.com"
});

module.exports = {
    admin
}
