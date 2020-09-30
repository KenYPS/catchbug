
let express = require('express')
const app = express()
const bodyParser = require('body-parser')
const firebase = require('./firebase')
const port = process.env.PORT || 5000

const firebaseDB = firebase.database()
ㄍ
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
    console.log(req.query)
    const { account, site } = req.query
    const data = firebase.database().ref(`${site}/${account}`)
    console.log(data);
    res.send(resCode)
})


app.listen(port, () => console.log(`listen on port ${port}`))