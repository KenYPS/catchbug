const error_code = require('./errorCode')
const globalStore = { 
    itemList:[],
    resCode: (code, result = [])=>({
        error_code: code,
        error_msg: error_code[code],
        result
    }),
    users:[]
};

module.exports = globalStore;


