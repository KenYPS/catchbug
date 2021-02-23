const axios = require('axios')

function linebotPushMessage (data) {
  axios.post('https://api.line.me/v2/bot/message/push', data, {
    headers: {
      Authorization: `Bearer ${process.env.line_channelAccessToken}`
    }
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}
module.exports = {
  linebotPushMessage
}
