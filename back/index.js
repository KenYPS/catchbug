
let express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { admin } = require('./firebase')
const { abstractAccount} =require('./Utils')
require('./getBug')

const port = process.env.PORT || 5000

const firebaseDB = admin.database()

const resCode = {
    error_code: 1,
    error_msg: "SUCCESS",
    log_id: "",
    result: []
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.get('/getList', (req, res) => {
    const { site } = req.query
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        const { error_code } = resCode
        if (error_code) {
            firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
                resCode.result = snap.val()
                res.send(resCode)
            })
        }
    })
})

const checkAuth = (token) => {
    return admin.auth().verifyIdToken(token).then(res => {
        const { email } = res
        const account = abstractAccount(email)
        return account
    }, err => {
        resCode.error_msg = err
        return resCode
    })
}


app.listen(port, () => console.log(`listen on port ${port}`))
