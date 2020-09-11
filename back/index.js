
let express = require('express');
const app = express()
const bodyParser = require('body-parser');

const firebase = require('./firebase')
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.raw());

const resData ={
    result:'',
    error_code:1,
    error_msg:''
}

function resolveFunc (){

}

function catchFunc() {

}

app.post('/login', function (req, res) {
    const { account, password } = req.body
})

app.get('/', function (req, res) {
    console.log(res);
    res.send('hello world')
});

app.listen(port, ()=>console.log(`listen on port ${port}`));