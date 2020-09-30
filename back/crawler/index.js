const request = require("request")
const cheerio = require("cheerio")
const globalStore = require('../store')

const startCrawler = (list = []) => {
    const iteralList = async () => {
        const lists = await Promise.all(
            list.map(crawl)
        )
        globalStore.itemLists = lists
        // console.log(globalStore.itemLists)
        return lists
    }
    iteralList()
    setInterval(iteralList, 5 * 60 * 1000)
}


function crawl(itemNum) {
    const url = `https://www.costco.com.tw/search?text=${itemNum}`
    return new Promise((resolve, reject) => {
        request({ url }, function (error, response, body) {
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
            const itemStockStatus = itemContainer.find('.stock-status .out-of-stock-message').text()
            const itemLink = itemContainer.find('a').attr('href')
            const data = {
                itemImg: `https://www.costco.com.tw/medias/sys_master${itemImg}`,
                itemName,
                itemPrice,
                itemStockStatus,
                itemLink: `https://www.costco.com.tw/${itemLink}`,
                itemNum
            }
            resolve(data)
        })
    })
}

module.exports = startCrawler

