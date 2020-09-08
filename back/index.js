
let express = require('express');
const app = express()
const port = process.env.PORT || 5000;
// respond with "hello world" when a GET request is made to the homepage

const db = require('./firebase')

    db.collection('users').doc('alovelace')
    
app.post('/login', function (req, res) {
    console.log(2222);
    db.set({first:111})
});


app.get('/menuList', function (req, res) {
    console.log(res);
    res.send('hello world')
});


app.listen(port, ()=>console.log(`listen on port ${port}`));