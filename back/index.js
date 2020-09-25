
const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const { admin } = require('./firebase')
const { abstractAccount } = require('./Utils')
require('./getBug')
const globalStore = require('./store')
const path = require('path')

const { resCode } = globalStore

const firebaseDB = admin.database()

if (process.env.NODE_ENV === 'production')
    app.use(express.static(path.join(__dirname, '../build')))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

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
            firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
                const userItemLists = snap.val()
                return [...userItemLists, addValue]
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


function getUserItemList({ site, account, res }, data) {
    firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
        const { itemLists } = globalStore
        const userItemLists = snap.val()
        if (!userItemLists) {
            console.log(site);
            firebaseDB.ref(`${site}`).update({ [account]: [{createTime:new Date()}] })
        }

        data = itemLists.filter(v => userItemLists.indexOf(v.itemNum) > -1)

        resCode.result = data
        res.send(resCode)
    })
}

if (process.env.NODE_ENV === 'production')
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '../build/index.html'))
    })

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})