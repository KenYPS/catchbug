const axios = require('axios')

function linebotPushMessage (data){
    console.log(11111111111111);
    console.log(data);
     axios.post(`https://api.line.me/v2/bot/message/push`, data,{
         headers:{
             Authorization:`Bearer ${process.env.line_channelAccessToken}`
         }
     }).then(res=>{
         console.log(2222222222222222222);
         console.log(res);
     }).catch(err=>{
         console.log(333333333333333333333);
         console.log(err);

     })
}
module.exports ={
    linebotPushMessage
}

