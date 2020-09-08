
let express = require('express');
const app = express()
const bodyParser = require('body-parser');
const firebase = require('./firebase')
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));


    
app.post('/login', function (req, res) {
    console.log(req.body);
});


app.get('/menuList', function (req, res) {
    console.log(res);
    res.send('hello world')
});


app.listen(port, ()=>console.log(`listen on port ${port}`));