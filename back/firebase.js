const firebase = require('firebase')

const config = require('../src/config')

firebase.initializeApp(config)

module.exports = firebase
