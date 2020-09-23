const request = require("request")
const cheerio = require("cheerio")

const startCrawler = (list = []) => {
    const iteralList = () => {
     const newItemList = []

        for (let i = 0; i < list.length; i++) {
         crawl(list[i])
        }

        console.log(newItemList);

    }
    iteralList()
    setInterval(iteralList, 60 * 1000)
}


const crawl =  function (itemNum ,callback) {
    request({
        url: `https://www.costco.com.tw/search?text=${itemNum}`, // 
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return
        }
        const $ = cheerio.load(body) // 載入 body
        const itemContainer = $(`
           #mainSearchComponentDivGridList
           .product-listing-container
           ul
           li
            `
        )
        const itemImg = itemContainer.find('a img').attr('src')
        const itemName = itemContainer.find('.product-info-wrapper .product-list-details .product-name-container a').text()
        const itemPrice = itemContainer.find('.product-info-wrapper .product-price-amount').text().trim()
        const itemStockStatus = !itemContainer.find('.stock-status .out-of-stock-message').text()
        const data = {
            itemImg: `https://www.costco.com.tw/medias/sys_master${itemImg}`,
            itemName,
            itemPrice,
            itemStockStatus
        }

            callback(data) 
    })
}



module.exports = startCrawler

