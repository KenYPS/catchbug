const firebase = require('firebase')

const serviceAccount = require('./config.json')

firebase.initializeApp({
    apiKey: "AIzaSyBxAFJNcRi0dF2BVMnLBjF-HqZQdNfuAS0",
    authDomain: "catchbug-f8326.firebaseapp.com",
    databaseURL: "https://catchbug-f8326.firebaseio.com",
    projectId: "catchbug-f8326",
    storageBucket: "catchbug-f8326.appspot.com",
    messagingSenderId: "79127123951",
    appId: "1:79127123951:web:946cbdf80d0bfa276ec81a",
    measurementId: "G-TGXGE92TFY"
})

module.exports = firebase
