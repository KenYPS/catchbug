
const express = require('express')
require('dotenv').config();
const app = express()
const bodyParser = require('body-parser')
const { admin } = require('./firebase')
const { abstractAccount } = require('./Utils')
require('./getBug')
const globalStore = require('./store')
const { resCode } = globalStore
const port =  5000

const firebaseDB = admin.database()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.get('/getList', (req, res) => {
    const { site } = req.query
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        if (resCode.error_code) {
            getUserItemList({ site, account ,res})
        }
    })
})

app.put('/addList', (req, res) => {
    const { addValue, site} = req.body 
    const token = req.headers.token
    checkAuth(token, res).then(account => {
        if (resCode.error_code) {
            firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
                const userItemLists = snap.val()
                return [...userItemLists, addValue]
            }).then(list=>{
                firebaseDB.ref(`${site}/${account}`).set(list, err=>{
                    if(!err){
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


function getUserItemList({ site, account, res}) {
    firebaseDB.ref(`${site}/${account}`).once('value').then(snap => {
        const { itemLists } = globalStore
        const userItemLists = snap.val()
        const data = itemLists.filter(v => userItemLists.indexOf(v.itemNum) > -1)
        resCode.result = data
        res.send(resCode)
    })
}

app.listen(port, () => console.log(`listen on port ${port}`))
