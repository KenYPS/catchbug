const error_code = require('./errorCode')
const globalStore = {
  itemLists: [],
  resCode: (code, result = []) => ({
    error_code: code,
    error_msg: error_code[code],
    result
  }),
  users: {},
  userListData: []
}

module.exports = globalStore
