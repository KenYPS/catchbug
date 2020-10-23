require('dotenv').config()
require('./crawler/index')

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')

const { admin } = require('./firebase')
const { linebotParser } = require('./linebot')
const globalStore = require('./store')
const { abstractAccount } = require('./Utils')

const { resCode, users } = globalStore
const firebaseDB = admin.database()

const app = express()


// if (process.env.NODE_ENV === 'production')
app.use(express.static(path.join(__dirname, '../build')))

app.post('/linewebhook', linebotParser)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())



// ----------- line -----------

// app.get('/', (req, res) => {
//    const params = req.params
//     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl+'/#/'+params;
//     console.log(fullUrl);
//     res.redirect(fullUrl);
// })

app.post('/line/auth', (req, res) => {
    const access_token = req.headers.token
    console.log(access_token);
    getlineUserAuth(access_token, res)
})


app.get('/getList', (req, res) => {
    const { site } = req.query
    const access_token = req.headers.token
    const userId = users[access_token].userId
    firebaseGetUserItemList({ site, userId, res })

})

app.put('/addItem', (req, res) => {
    const access_token = req.headers.token
    const { addItemNum, site } = req.body
    const userId = users[access_token].userId
    firebaseAddList({ site, userId, res }, addItemNum)
})

app.put('/deleteItem', (req, res) => {
    const access_token = req.headers.token
    const { deleteItemNum, site } = req.body
    const userId = users[access_token].userId
    firebaseDeleteList({ site, userId, res }, deleteItemNum)
})


// if (process.env.NODE_ENV === 'production')
app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname + '../build/index.html'))
})

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})



// line 
function getlineUserAuth(access_token, res) {
    console.log(access_token);
    axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`).then(response => {
        const { expires_in } = response.data
        getUserProfile(access_token, expires_in).then(() => {
            const sendCode = resCode(1)
            res.send(sendCode)
        })
    }
    ).catch(err => {
        // console.log(err);
        const errCode = resCode(2)
        res.send(errCode)
    })
}

function getUserProfile(access_token, expires_in) {
    return axios.get('https://api.line.me/v2/profile', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        const { userId } = res.data
        users[access_token] = {}
        users[access_token].setTimeout = setTimeout(() => {
            delete users[access_token]
        }, expires_in)

        users[access_token].userId = userId
    })
}


//  firebase
function firebaseGetUserItemList({ site, userId, res }, data) {
    const { itemLists } = globalStore
    firebaseGetUserListPromise({ site, userId, res }).then((userItemLists = [], rej) => {

        console.log(userItemLists)
        data = itemLists.filter(v => userItemLists.indexOf(v.itemNum) > -1)

        const sendCode = resCode(1, data)
        res.send(sendCode)
    })
}


function firebaseAddList({ site, userId, res }, itemNum) {
    firebaseGetUserListPromise({ site, userId, res }).then((userItemLists, rej) => {
        if (userItemLists.includes(itemNum)) {
            const sendCode = resCode(1001)
            res.status(400).send(sendCode)
        } else {
            const newUserItemList = [...userItemLists, itemNum]
            firebaseSetUserNewListPromise({ site, userId, res }, newUserItemList)
        }
    }
    )
}

function firebaseDeleteList({ site, userId, res }, itemNum) {
    firebaseGetUserListPromise({ site, userId }).then(userItemLists => {
        return userItemLists.filter(v => v !== itemNum)
    })
    firebaseDB.ref(`${site}/${userId}`).once('value').then(snap => {
        const userItemLists = snap.val()
        return userItemLists.filter(v => v !== itemNum)
    }).then(newUserItemList => {
        firebaseSetUserNewListPromise({ site, userId, res }, newUserItemList)
    })
}

function firebaseGetUserListPromise({ site, userId }) {
    return firebaseDB.ref(`${site}/${userId}`).once('value').then(snap => {
        const userItemLists = snap.val()
        
        // if new user give default list in firebase
        if (!userItemLists) {
            firebaseDB.ref(`${site}`).update({ [userId]: ['9987741'] }).then(() => {
                firebaseGetUserListPromise({ site, userId })
            })
        } else {
            return userItemLists
        }
    })
}

function firebaseSetUserNewListPromise({ site, userId, res }, newUserItemList) {
    return firebaseDB.ref(`${site}/${userId}`).set(newUserItemList, err => {
        if (!err) {
            firebaseGetUserItemList({ site, userId, res })
        }
    })
}






// check auth before every connect
const checkGoogleAuth = (token) => {
    return admin.auth().verifyIdToken(token).then(res => {
        const { email } = res
        const account = abstractAccount(email)
        return account
    }, err => {
        resCode.error_msg = err
        return resCode
    })
}