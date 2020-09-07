const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")

const earthquake = function () {
    request({
        url: "https://www.costco.com.tw/search?text=%23199500", // 
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return
        }
        const $ = cheerio.load(body) // 載入 body
        const result = [] // 建立一個儲存結果的容器
        const table_tr = $(".BoxTable tr") // 爬最外層的 Table(class=BoxTable) 中的 tr


    })
}

earthquake()
// 每半小時爬一次資料
setInterval(earthquake, 30 * 60 * 1000)