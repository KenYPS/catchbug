var linebot = require('linebot')

var bot = linebot({
    channelId: 1654987617,
    channelSecret: process.env.line_channelSecret,
    channelAccessToken: process.env.line_channelAccessToken
})

bot.on('message', function (event) {
    // get user message from `event.message.text`
    // reply same message
    console.log(event);
    var replyMsg = `${event.message.text}`
    event.reply(replyMsg).then(function (data) {
        console.log('ok')
    }).catch(function (error) {
        console.error(error)
    })
});

bot.on('join',event=>{
    const userId = event.sourcer.userId
    bot.getUserProfile(userId).then(res=>{
        event.reply(`哈囉!歡迎加入本群組。如果想要新增品項，請登入以下網址
        `)
    })
} )

const linebotParser = bot.parser();
module.exports = {
    linebotParser,
    bot
}
