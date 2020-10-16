
require('dotenv').config()
require('./getBug')
// require('./redis')

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')
const url = require('url')
var jwtDecoded = require('jwt-decode')

const { admin } = require('./firebase')
const { linebotParser } = require('./linebot')
const globalStore = require('./store')
const { abstractAccount } = require('./Utils')
const line_login = require('../src/common/lineLogin')

const { resCode, users } = globalStore
const firebaseDB = admin.database()

const app = express()


// if (process.env.NODE_ENV === 'production')
app.use(express.static(path.join(__dirname, '../build')))

app.post('/linewebhook', linebotParser)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

// --------- google ------------

app.get('/getList', (req, res) => {
    const { site } = req.query
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        if (resCode.error_code) {
            getUserItemList({ site, account, res })
        }
    })
})

app.put('/addList', (req, res) => {
    const { addValue, site } = req.body
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        if (resCode.error_code) {
            firebaseDB.ref(`${site}/${account}`).once('value').then(snap => new Promise((resolve, rej) => {
                const userItemLists = snap.val()
                if (userItemLists.includes(addValue)) rej({ msg: '商品已在列表' })
                resolve([...userItemLists, addValue])
            })
            ).then(list => {
                firebaseDB.ref(`${site}/${account}`).set(list, err => {
                    if (!err) {
                        getUserItemList({ site, account, res })
                    }
                })
            }, err => {
                console.log(err)
                const { msg } = err
                const errRes = { ...resCode }
                errRes.error_code = 999
                errRes.error_msg = msg
                errRes.result = []
                res.send(errRes)
            })
        }
    })
})


app.put('/deleteList', (req, res) => {
    const { itemNum, site } = req.body
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        if (resCode.error_code) {
            firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
                const userItemLists = snap.val()
                return userItemLists.filter(v => v !== itemNum)
            }).then(list => {
                firebaseDB.ref(`${site}/${account}`).set(list, err => {
                    if (!err) {
                        getUserItemList({ site, account, res })
                    }
                })
            })
        }
    })
})


// check auth before every connect
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



// ----------- line -----------
app.post('/line/login', (req, res) => {
    const code = req.body.code
    let data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: line_login.redirect_uri,
        client_id: line_login.client_id,
        client_secret: process.env.line_login_channelSecret
    }
    const params = new url.URLSearchParams(data)
    getLineToken(params, res)
})

app.post('/line/auth', (req, res) => {
    const access_token = req.headers.token
    getlineUserAuth(access_token, res)
})




app.get('/line/getList', (req, res) => {
    const { site } = req.query
    const idtoken = req.headers.idtoken
    const decoded = jwtDecoded(idtoken)
    const { email } = decoded
    const account = abstractAccount(email)

    getUserItemList({ site, account, res })

})





// if (process.env.NODE_ENV === 'production')
app.get('*', (req, res) => {
    // res.redirect('/#/test')
    // res.sendFile(path.join(__dirname + '../build/index.html'))
})

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})


function getlineUserAuth(access_token, res) {
    axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`).then(response => {
        console.log(response.data)
        const sendCode = resCode(1)
        res.send(sendCode)
    }
    ).catch(err => {
        const errCode = resCode(2)
        res.send(errCode)
    }).then(res => {
    })
}

function getLineToken(params, res) {
    axios.post('https://api.line.me/oauth2/v2.1/token', params.toString()).then(restoken => {
        const { id_token, access_token } = restoken.data
        const decoded = jwtDecoded(id_token)
        const { name, email } = decoded
        console.log(decoded)
        const data = {
            name,
            email,
            access_token
        }
        const sendCode = resCode(1, data)
        res.send(sendCode)
    }, err => {
        console.log(err.response.data)
    })
}

function getUserItemList({ site, account, res }, data) {
    firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
        const { itemLists } = globalStore
        const userItemLists = snap.val()
        if (!userItemLists) {
            firebaseDB.ref(`${site}`).update({ [account]: ['9987741'] })
        }
        data = itemLists.filter(v => userItemLists.indexOf(v.itemNum) > -1)
        resCode.result = data
        const sendCode = resCode(1, data)
        res.send(sendCode)
    })
}

function getUserProfile(access_token) {
    axios.get('https://api.line.me/v2/profile', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        const { userId } = res.data
        console.log(userId)
    })
}